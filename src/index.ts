import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import fs from 'fs'
import path from 'path'
import { input } from '@inquirer/prompts'

let functionCount = 0
let componentCount = 0
let propCount = 0

// Analyser le code d'un fichier
function analyzeFile(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf8')

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  // Analyser l'AST pour compter les composants, fonctions et props
  traverse(ast, {
    FunctionDeclaration(path: string) {
      functionCount++
    },
    JSXElement(path: any) {
      componentCount++
      propCount += path.node.openingElement.attributes.length
    },
  })
}

// Analyser tous les fichiers JavaScript/TypeScript dans un répertoire
function analyzeDirectory(directoryPath: string) {
  const filePaths = fs.readdirSync(directoryPath)
  filePaths.forEach((filePath) => {
    if (
      filePath.endsWith('.js') ||
      filePath.endsWith('.jsx') ||
      filePath.endsWith('.ts') ||
      filePath.endsWith('.tsx')
    ) {
      analyzeFile(path.join(directoryPath, filePath))
    }
  })
}

const answer = await input({
  message: 'Quel est le chemin du projet à analyser ?',
  default: '.',
})
  .then((answers) => {
    const projectPath = path.resolve(answers)
    analyzeDirectory(projectPath)
    console.log(`Nombre de fonctions : ${functionCount}`)
    console.log(`Nombre de composants : ${componentCount}`)
    console.log(`Nombre de props : ${propCount}`)
  })
  .catch(console.error)

import sharp from 'sharp'
import { readFileSync } from 'fs'

// Use the square icon SVG (not the wide logo)
const svg = readFileSync('public/favicon.svg')

await sharp(svg).resize(32, 32).png().toFile('public/favicon-32.png')
await sharp(svg).resize(16, 16).png().toFile('public/favicon-16.png')
await sharp(svg).resize(180, 180).png().toFile('public/apple-touch-icon.png')
await sharp(svg).resize(192, 192).png().toFile('public/icon-192.png')

console.log('Favicons erstellt!')

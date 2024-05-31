#!/usr/bin/env node

import {Command, Option} from 'commander/esm.mjs'
import {processImages} from './processImages.mjs'
import {parseQualityOption} from './utils.mjs'
import {SUPPORTED_FORMATS, DEFAULT_FORMATS, DEFAULT_QUALITY} from './constants.mjs'

const program = new Command()

program.addOption(
  new Option('-f, --formats <formats...>', 'images formats')
    .default(DEFAULT_FORMATS)
    .choices(SUPPORTED_FORMATS),
)

program
    .option('-q, --quality <number>', 'optimize quality in range 1 to 100', parseQualityOption, DEFAULT_QUALITY)
    .option('-n, --no-webp', 'disable convert to webp')
    .option('-rc, --rewrite-cache', 'rewrites cache', false)
    .argument('<dirPath>', 'path to directory with images')

program.parse()

const [dirPath] = program.args
await processImages(dirPath, program.opts())

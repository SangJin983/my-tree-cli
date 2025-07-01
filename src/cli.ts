#!/usr/bin/env node

import { program } from "commander";
import { createTree } from "./logic/createTree";
import { filterTree } from "./logic/filterTree";
import { formatTree } from "./logic/formatTree";
import { validateTree } from "./logic/validateTree";

program
  .version("1.0.0")
  .description("디렉토리 구조를 생성합니다.")
  .argument("<path>", "분석할 디렉토리 경로.")
  .option(
    "-e, --exclude <items>",
    "제외할 파일들과 폴더를 담은 쉼표 목록 (e.g., 'node_modules,.git')"
  )
  .action((dirPath: string, options: { exclude?: string }) => {
    const excludeList = options.exclude ? options.exclude.split(",") : [];

    console.log(`"${dirPath}" 분석 중...`);

    const finalResult = createTree(dirPath)
      .bind(validateTree)
      .bind((tree) => filterTree(tree, excludeList))
      .bind((filteredTree) => formatTree(filteredTree));

    if (finalResult.isOk()) {
      const output = finalResult.unwrap();
      if (output) {
        console.log(output);
      } else {
        console.log(`"${dirPath}"폴더가 비었거나 모두 필터링 되었습니다`);
      }
      process.exit(0);
    } else {
      const error = finalResult.error;
      console.error(`\n❌ Error:`);
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

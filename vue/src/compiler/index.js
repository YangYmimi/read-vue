/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 解析：模板转换成对象（AST，抽象语法树）
  const ast = parse(template.trim(), options)

  // 优化：标记一些静态节点，diff算法就可以直接忽略，节省diff时间
  if (options.optimize !== false) {
    optimize(ast, options)
  }

  // 代码生成：将AST转换成代码字符串 new Function(code) 就可以得到函数
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})

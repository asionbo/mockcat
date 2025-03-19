export type Language = 'en' | 'zh';

export type TranslationKeys = {
  title: string;
    slogan: string;
  poweredBy: string;
  description: string;
  tableStructure: string;
  recordCount: string;
  generateButton: string;
  generating: string;
  simpleFormat: string;
  sqlFormat: string;
  simpleFormatDesc: string;
  sqlFormatDesc: string;
  inputPlaceholderSimple: string;
  inputPlaceholderSQL: string;
  formatHintSimple: string;
  formatHintSQL: string;
  errorTitle: string;
  errorEmptyStructure: string;
  errorGeneration: string;
  successTitle: string;
  successMessage: string;
  generatedDataTitle: string;
  generatedDataDesc: string;
  copiedTitle: string;
  copiedJson: string;
  copiedSql: string;
  noData: string;
  errorDisplayTable: string;
  errorSqlGeneration: string;
  footer: string;
  about: string;
  documentation: string;
  github: string;
  partialSuccessTitle: string;
  partialSuccessMessage: string;
  largeDatasetWarning: string;
};

export const translations: Record<Language, TranslationKeys> = {
  en: {
    title: 'MockCat',
    slogan: "Mock Data Generator",
    poweredBy: 'Powered by Gemini AI',
    description: 'Enter your table structure and we\'ll generate realistic mock data for you',
    tableStructure: 'Table Structure',
    recordCount: 'Number of Records',
    generateButton: 'Generate Mock Data',
    generating: 'Generating...',
    simpleFormat: 'Simple Format',
    sqlFormat: 'SQL CREATE TABLE',
    simpleFormatDesc: 'Format: columnName: dataType, columnName: dataType, ...',
    sqlFormatDesc: 'Format: CREATE TABLE tableName (column1 dataType, column2 dataType, ...)',
    inputPlaceholderSimple: 'Enter your table structure (e.g., id: number, name: string, email: string, age: number)',
    inputPlaceholderSQL: 'Enter SQL CREATE TABLE statement (e.g., CREATE TABLE users (...))',
    formatHintSimple: 'Format: columnName: dataType, columnName: dataType, ...',
    formatHintSQL: 'Format: CREATE TABLE tableName (column1 dataType, column2 dataType, ...)',
    errorTitle: 'Error',
    errorEmptyStructure: 'Please enter a table structure',
    errorGeneration: 'Failed to generate mock data',
    successTitle: 'Success',
    successMessage: 'Mock data generated successfully!',
    generatedDataTitle: 'Generated Mock Data',
    generatedDataDesc: 'Your mock data is ready to use',
    copiedTitle: 'Copied!',
    copiedJson: 'Mock data copied to clipboard',
    copiedSql: 'SQL INSERT statements copied to clipboard',
    noData: 'No data to display',
    errorDisplayTable: 'Error displaying table:',
    errorSqlGeneration: 'Error generating SQL statements:',
    footer: '© {year} MockCat. All rights reserved.',
    about: 'About',
    documentation: 'Documentation',
    github: 'GitHub',
    partialSuccessTitle: "Partial Data Generated",
  partialSuccessMessage: "{generated} records were successfully generated. Some records couldn't be created.",
  largeDatasetWarning: "Generating large datasets may take longer and could be less reliable for complex structures."

  },
  zh: {
    title: 'MockCat',
    slogan: "模拟数据生成器",
    poweredBy: '由 Gemini AI 提供支持',
    description: '输入您的表格结构，我们将为您生成逼真的模拟数据',
    tableStructure: '表格结构',
    recordCount: '记录数量',
    generateButton: '生成模拟数据',
    generating: '生成中...',
    simpleFormat: '简单格式',
    sqlFormat: 'SQL CREATE TABLE',
    simpleFormatDesc: '格式：列名: 数据类型, 列名: 数据类型, ...',
    sqlFormatDesc: '格式：CREATE TABLE 表名 (列1 数据类型, 列2 数据类型, ...)',
    inputPlaceholderSimple: '输入表格结构 (例如：id: number, name: string, email: string, age: number)',
    inputPlaceholderSQL: '输入 SQL CREATE TABLE 语句 (例如：CREATE TABLE users (...))',
    formatHintSimple: '格式：列名: 数据类型, 列名: 数据类型, ...',
    formatHintSQL: '格式：CREATE TABLE 表名 (列1 数据类型, 列2 数据类型, ...)',
    errorTitle: '错误',
    errorEmptyStructure: '请输入表格结构',
    errorGeneration: '生成模拟数据失败',
    successTitle: '成功',
    successMessage: '模拟数据生成成功！',
    generatedDataTitle: '已生成的模拟数据',
    generatedDataDesc: '您的模拟数据已准备就绪',
    copiedTitle: '已复制！',
    copiedJson: '模拟数据已复制到剪贴板',
    copiedSql: 'SQL INSERT 语句已复制到剪贴板',
    noData: '没有可显示的数据',
    errorDisplayTable: '显示表格时出错：',
    errorSqlGeneration: '生成 SQL 语句时出错：',
    footer: '© {year} MockCat. 保留所有权利。',
    about: '关于',
    documentation: '文档',
    github: 'GitHub',
    partialSuccessTitle: "部分数据已生成",
    partialSuccessMessage: "{generated} 条记录已成功生成。一些记录无法创建。",
    largeDatasetWarning: "生成大型数据集可能需要更长时间，对于复杂结构可能不太可靠。"
  }
};

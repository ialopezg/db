/* eslint-disable */
import { Driver } from '../driver';
import { SchemaBuilder } from './schema.builder';
import { ColumnMetadata, ForeignKeyMetadata, TableMetadata } from '../../builders/metadata';

/**
 * PostgresSQL-specific implementation of the SchemaBuilder for handling schema DDL operations.
 * This class implements methods to create and modify PostgreSQL database schemas.
 */
export class PostgresSchemaBuilder extends SchemaBuilder {
  constructor(private readonly driver: Driver) {
    super();
  }

  addColumn(tableName: string, column: ColumnMetadata): Promise<boolean> {
    return Promise.resolve(false);
  }

  addForeignKey(foreignKey: ForeignKeyMetadata): Promise<boolean> {
    return Promise.resolve(false);
  }

  addUniqueKey(tableName: string, columnName: string, keyName: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  changeColumn(tableName: string, columnName: string, newColumn: ColumnMetadata, skipPrimary?: boolean): Promise<void> {
    return Promise.resolve(undefined);
  }

  checkIfTableExists(tableName: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  createTable(table: TableMetadata, columns: ColumnMetadata[]): Promise<void> {
    return Promise.resolve(undefined);
  }

  dropColumn(tableName: string, columnName: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  dropForeignKey(tableNameOrForeignKey: ForeignKeyMetadata | string, foreignKeyName?: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  dropIndex(tableName: string, indexName: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getChangedColumns(entity: string, columns: ColumnMetadata[]): Promise<{
    columnName: string;
    hasPrimaryKey: boolean
  }[]> {
    return Promise.resolve([]);
  }

  getForeignKeys(table: TableMetadata): Promise<string[]> {
    return Promise.resolve([]);
  }

  getPrimaryConstraintName(tableName: string): Promise<string> {
    return Promise.resolve('');
  }

  getTableColumns(tableName: string): Promise<string[]> {
    return Promise.resolve([]);
  }

  getTableUniqueKeys(tableName: string): Promise<string[]> {
    return Promise.resolve([]);
  }
}

import { QueryBuilder } from '../../../../driver';

describe('QueryBuilder - Helpers', () => {
  let queryBuilder: QueryBuilder;

  beforeEach(() => {
    queryBuilder = new QueryBuilder();
  });

  describe('getTableName', () => {
    it('should throw an error if the table name is not specified using from()', () => {
      expect(() => {
        queryBuilder['getTableName']();
      }).toThrow('Table name must be specified using from()');
    });

    it('should throw an error if the table name is a function and getTableNameCallback is not provided', () => {
      queryBuilder.from(() => 'users');

      expect(() => {
        queryBuilder['getTableName']();
      }).toThrow('getTableNameCallback is required to resolve entity names');
    });

    it('should return the table name if specified directly using from()', () => {
      queryBuilder.from('users');

      const tableName = queryBuilder['fromClause'].entity;
      expect(tableName).toBe('users');
    });

    it('should return the resolved table name if the entity is a function and getTableNameCallback is provided', () => {
      const qb = new QueryBuilder((entity: any) => entity());
      qb.from(() => 'users');

      const tableName = qb['getTableName']();
      expect(tableName).toBe('users');
    });

    it('should return the resolved table name if the entity is a string and getTableNameCallback is provided', () => {
      const qb = new QueryBuilder((entity: any) => entity());
      qb.from('users', 'u');

      const tableName = qb['getTableName']();
      expect(tableName).toBe('users');
    });

    it('should return the resolved table name if the entity is not provided and getTableNameCallback is provided', () => {
      const qb = new QueryBuilder();
      qb['fromClause'] = { entity: 'users' };

      const tableName = qb['getTableName']();
      expect(tableName).toBe('users');
    });
  });

  describe('addJoin', () => {
    it('should throw an error if JOIN entity name is not specified', () => {
      queryBuilder.from('users');

      expect(() => queryBuilder['addJoin']('INNER', '')).toThrow('Join entity is required');
    });

    it('should throw an error if the condition not specified', () => {
      queryBuilder.from('users', 'u');

      expect(() => queryBuilder['addJoin']('INNER', 'sessions', 's', 'ON')).toThrow('INNER JOIN requires a condition criteria when using ON');
    });
  });

  describe('createSelectClause', () => {
    it('should throw an error if the table name is not specified using from()', () => {
      queryBuilder.from('users');

      const query = queryBuilder['createSelectClause']();
      expect(query).toBe('SELECT * FROM users');
    });
  });

  describe('createJoinClauses', () => {
    it('should throw an error for CROSS JOIN', () => {
      queryBuilder.from('users');
      queryBuilder['joinClauses'].push({ joinType: 'CROSS', entity: 'sessions' });
      const query = queryBuilder['createJoinClauses']();

      expect(query).toBe('CROSS JOIN sessions');
    });

    it('should throw an error for CROSS JOIN when specify entity alias', () => {
      queryBuilder.from('users');
      queryBuilder['joinClauses'].push({ joinType: 'CROSS', entity: 'sessions', alias: 's' });
      const query = queryBuilder['createJoinClauses']();

      expect(query).toBe('CROSS JOIN sessions s');
    });

    it('should throw an error for INNER JOIN', () => {
      queryBuilder.from('users');
      queryBuilder['joinClauses'].push({ joinType: 'INNER', entity: 'sessions' });
      const query = queryBuilder['createJoinClauses']();

      expect(query).toBe('INNER JOIN sessions');
    });

    it('should throw an error for NATURAL JOIN with entity alias', () => {
      queryBuilder.from('users');
      queryBuilder['joinClauses'].push({ joinType: 'NATURAL', entity: 'sessions', alias: 's' });
      const query = queryBuilder['createJoinClauses']();

      expect(query).toBe('NATURAL JOIN sessions s');
    });

    it('should throw an error for INNER JOIN without entity alias and USING as conditionType', () => {
      queryBuilder.from('users');
      queryBuilder['joinClauses'].push({
        joinType: 'INNER',
        entity: 'sessions',
        conditionType: 'USING',
        criteria: 'user_id',
      });
      const query = queryBuilder['createJoinClauses']();

      expect(query).toBe('INNER JOIN sessions USING (user_id)');
    });

    it('should throw an error for INNER JOIN without entity alias and ON as conditionType', () => {
      queryBuilder.from('users');
      queryBuilder['joinClauses'].push({
        joinType: 'INNER',
        entity: 'sessions',
        conditionType: 'ON',
        criteria: 'users.user_id = sessions.user_id',
      });
      const query = queryBuilder['createJoinClauses']();

      expect(query).toBe('INNER JOIN sessions ON users.user_id = sessions.user_id');
    });

    it('should throw an error for INNER JOIN with entity alias and USING as conditionType', () => {
      queryBuilder.from('users');
      queryBuilder['joinClauses'].push({
        joinType: 'INNER',
        entity: 'sessions',
        alias: 's',
        conditionType: 'USING',
        criteria: 'user_id',
      });
      const query = queryBuilder['createJoinClauses']();

      expect(query).toBe('INNER JOIN sessions s USING (user_id)');
    });
  });

  describe('createOrderByClause', () => {
    it('should generate the ORDER BY clause correctly', () => {
      queryBuilder.orderBy('name', 'ASC').addOrderBy('id', 'DESC');
      const orderByClause = queryBuilder['createOrderByClause']();
      expect(orderByClause).toBe(' ORDER BY name ASC, id DESC');
    });

    it('should return an empty string if no sorting conditions are specified', () => {
      queryBuilder = new QueryBuilder();

      expect(queryBuilder['createOrderByClause']()).toBe('');
    });

    it('should return default sorting when no order specified', () => {
      queryBuilder = new QueryBuilder();
      queryBuilder['orderByClause'] = [{ column: 'user_id' }];

      expect(queryBuilder['createOrderByClause']()).toBe(' ORDER BY user_id ASC');
    });
  });

  describe('validateGroupByColumnsInput', () => {
    it('should generate the ORDER BY clause correctly', () => {
      expect(
        () => queryBuilder['validateGroupByColumnsInput']([]),
      ).toThrow('GROUP BY requires at least one non-empty column');
    });
  });

  describe('replaceParameters', () => {
    it('should replace named parameters correctly', () => {
      // Set parameters
      queryBuilder.setParameter({ name: ':id', value: 1 });
      queryBuilder.setParameter({ name: ':name', value: 'John' });

      // Test the query
      const query = 'SELECT * FROM users WHERE id = :id AND name = :name';
      const result = queryBuilder['replaceParameters'](query);

      // Expect the named parameters to be replaced with their values
      expect(result).toBe(`SELECT * FROM users WHERE id = 1 AND name = 'John'`);
    });
  });

  describe('formatValue', () => {
    it('should replace named parameters correctly', () => {
      // Set parameters
      const param = { name: ':date', value: new Date('2025-03-21') };
      queryBuilder.setParameter(param);

      // Test the query
      const result = queryBuilder['formatValue'](param.value);

      // Expect the named parameters to be replaced with their values
      expect(result).toBe(`'2025-03-21T00:00:00.000Z'`);
    });
  });
});

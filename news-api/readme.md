

# 外键的action
- CASCADE: 从父表删除或更新行时，与子表相匹配的数据也会被删除或更新
    ```
    Delete or update the row from the parent table and automatically delete or update the matching rows in the child table. Both ON DELETE CASCADE and ON UPDATE CASCADE are supported. 
    ----其他补充
    Between two tables, do not define several ON UPDATE CASCADE clauses that act on the same column in the parent table or in the child table.
    If a FOREIGN KEY clause is defined on both tables in a foreign key relationship, making both tables a parent and child, an ON UPDATE CASCADE or ON DELETE CASCADE subclause defined for one FOREIGN KEY clause must be defined for the other in order for cascading operations to succeed. If an ON UPDATE CASCADE or ON DELETE CASCADE subclause is only defined for one FOREIGN KEY clause, cascading operations fail with an error.
    Cascaded foreign key actions do not activate triggers.
    ```
- SET NULL: 从父表中删除或更新行时，同时把子表的外键字段的值或其他字段的值设为null
    ```
    Delete or update the row from the parent table and set the foreign key column or columns in the child table to NULL. Both ON DELETE SET NULL and ON UPDATE SET NULL clauses are supported.
    If you specify a SET NULL action, make sure that you have not declared the columns in the child table as NOT NULL.
    ```
- RESTRICT: 不允许从父表中删除或更新
    ```
    Rejects the delete or update operation for the parent table. Specifying RESTRICT (or NO ACTION) is the same as omitting the ON DELETE or ON UPDATE clause.
    ```
- NO ACTION：如果子表中外键字段的值与父表的值相关联，则不允许父表的删除或更新。即必须先删除与父表的值有关联的子表数据后，才能删除父表对应行
    ```
     A keyword from standard SQL. In MySQL, equivalent to RESTRICT. The MySQL Server rejects the delete or update operation for the parent table if there is a related foreign key value in the referenced table. Some database systems have deferred checks, and NO ACTION is a deferred check. In MySQL, foreign key constraints are checked immediately, so NO ACTION is the same as RESTRICT.
    ```
- SET DEFAULT: 
    ```
    This action is recognized by the MySQL parser, but both InnoDB and NDB reject table definitions containing ON DELETE SET DEFAULT or ON UPDATE SET DEFAULT clauses.
    ```
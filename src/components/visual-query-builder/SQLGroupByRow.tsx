import { SelectableValue } from '@grafana/data';
import { AccessoryButton, EditorList, InputGroup } from '@grafana/experimental';
import { Select } from '@grafana/ui';
import { QueryEditorGroupByExpression } from 'expressions';
import React, { useCallback } from 'react';
import { SQLExpression } from 'types';
import { toOption } from 'utils/data';
import { setGroupByField } from 'utils/sql.utils';

interface SQLGroupByRowProps {
  sql: SQLExpression;
  onSqlChange: (sql: SQLExpression) => void;
  columns?: Array<SelectableValue<string>>;
}

export function SQLGroupByRow({ sql, columns, onSqlChange }: SQLGroupByRowProps) {
  const onGroupByChange = useCallback(
    (item: Array<Partial<QueryEditorGroupByExpression>>) => {
      // As new (empty object) items come in, we need to make sure they have the correct type
      const cleaned = item.map((v) => setGroupByField(v.property?.name));
      const newSql = { ...sql, groupBy: cleaned };
      onSqlChange(newSql);
    },
    [onSqlChange, sql]
  );

  return (
    <EditorList<QueryEditorGroupByExpression>
      items={sql.groupBy!}
      onChange={onGroupByChange}
      renderItem={makeRenderColumn({
        options: columns,
      })}
    />
  );
}

function makeRenderColumn({ options }: { options?: Array<SelectableValue<string>> }) {
  const renderColumn = function (
    item: Partial<QueryEditorGroupByExpression>,
    onChangeItem: (item: QueryEditorGroupByExpression) => void,
    onDeleteItem: () => void
  ) {
    return (
      <InputGroup>
        <Select
          value={item.property?.name ? toOption(item.property.name) : null}
          aria-label="Group by"
          options={options}
          menuShouldPortal
          onChange={({ value }) => value && onChangeItem(setGroupByField(value))}
        />
        <AccessoryButton aria-label="Remove group by column" icon="times" variant="secondary" onClick={onDeleteItem} />
      </InputGroup>
    );
  };
  return renderColumn;
}

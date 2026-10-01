"use client";

import { useMemo, useState } from "react";

type Entity = {
  id: string;
};

export function useCrudCollection<T extends Entity>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const addItem = (item: T) => {
    setItems((current) => [item, ...current]);
    setPage(1);
  };

  const updateItem = (item: T) => {
    setItems((current) => current.map((record) => (record.id === item.id ? item : record)));
  };

  const deleteItem = (id: string) => {
    setItems((current) => current.filter((record) => record.id !== id));
  };

  const filteredItems = useMemo(() => items, [items]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  return {
    items,
    setItems,
    query,
    setQuery,
    page,
    setPage,
    pageSize,
    totalPages,
    paginatedItems,
    addItem,
    updateItem,
    deleteItem
  };
}

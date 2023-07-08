
export const REACT_APP_GENIE_RESOLVE_API = `${process.env.REACT_APP_GENIE_RESOLVE_API}`;

export const REACT_APP_GENIE_RESOLVE_VERSION = `${process.env.REACT_APP_GENIE_RESOLVE_VERSION}`;

export type sortObj = { sortOn: string | null; sortBy: "asc" | "desc" | null };

export const onChangeSortObj = (event: any, sortObj: sortObj) => {
  const id = event?.target?.id;
  console.log(id, "id");
  if (!sortObj?.sortBy) sortObj = { sortOn: id, sortBy: "asc" };
  else {
    if (sortObj.sortOn === id && sortObj.sortBy === "asc")
      sortObj.sortBy = "desc";
    else if (sortObj.sortOn === id && sortObj.sortBy === "desc")
      sortObj = { sortOn: "_id", sortBy: "asc" };
    else sortObj = { sortOn: id, sortBy: "asc" };
  }
  return sortObj;
};
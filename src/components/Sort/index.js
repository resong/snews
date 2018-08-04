import React, { Component } from "react";
import { sortBy } from "lodash";
import classNames from "classnames";

import Button from "../Button";

export const SORT_CRITERIA = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title"),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, "num_comments").reverse(),
  POINTS: list => sortBy(list, "points").reverse()
};

class Sort extends Component {
  render() {
    const {
      sortKey,
      onSort,
      children,
      activeSortKey,
      isSortReverse
    } = this.props;

    const sortClass = classNames("button-inline", {
      "button-active": sortKey === activeSortKey
    });

    return (
      <Button className={sortClass} onClick={() => onSort(sortKey)}>
        {children}
        {activeSortKey !== "NONE" ? (
          sortKey === activeSortKey ? (
            isSortReverse ? (
              <i className="fa fa-caret-up sort-icon" />
            ) : (
              <i className="fa fa-caret-down sort-icon" />
            )
          ) : null
        ) : null}
      </Button>
    );
  }
}

export default Sort;

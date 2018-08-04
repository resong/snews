import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Sort from "../Sort";

Enzyme.configure({ adapter: new Adapter() });

describe("Sort", () => {
  let sortKey, isSortReverse, activeSortKey, onSort, sort;

  beforeAll(() => {
    sortKey = "TITLE";
    isSortReverse = false;
    onSort = jest.fn();
    activeSortKey = "TITLE";
    sort = (
      <Sort
        sortKey={sortKey}
        isSortReverse={isSortReverse}
        onSort={onSort}
        activeSortKey={activeSortKey}
      />
    );
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(sort, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("has a valid snapshot", () => {
    const component = renderer.create(sort);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("calls onSort on click", () => {
    const btn = shallow(sort);
    btn.simulate("click");
    expect(onSort).toHaveBeenCalledTimes(1);
  });
});

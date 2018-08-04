import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Table from "../Table";

Enzyme.configure({ adapter: new Adapter() });

describe("Table", () => {
  let list, onDismiss, table;

  beforeAll(() => {
    list = [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" }
    ];
    onDismiss = jest.fn();
    table = <Table onDismiss={onDismiss} list={list} />;
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(table, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("has a valid snapshot", () => {
    const component = renderer.create(table);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("has two items in the list", () => {
    const element = shallow(table);
    expect(element.find(".table-row").length).toBe(2);
  });

  test("calls onDismiss on click", () => {
    const element = shallow(table);
    const btn = element.find("Button").first();
    btn.simulate("click");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

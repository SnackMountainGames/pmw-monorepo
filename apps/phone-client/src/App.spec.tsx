import { render } from "@testing-library/react";

import { PhoneClientApp } from "./App";

describe("App", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PhoneClientApp />);
    expect(baseElement).toBeTruthy();
  });

  it("should have a greeting as the title", () => {
    const { getAllByText } = render(<PhoneClientApp />);
    expect(
      getAllByText(new RegExp("PMW Phone Client", "gi")).length > 0,
    ).toBeTruthy();
  });
});

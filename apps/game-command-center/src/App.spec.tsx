import { render } from "@testing-library/react";

import { GameCommandCenterApp } from "./App";

describe("App", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<GameCommandCenterApp />);
    expect(baseElement).toBeTruthy();
  });

  it("should have a greeting as the title", () => {
    const { getAllByText } = render(<GameCommandCenterApp />);
    expect(
      getAllByText(new RegExp("PMW Phone Client", "gi")).length > 0,
    ).toBeTruthy();
  });
});

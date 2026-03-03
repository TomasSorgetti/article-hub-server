import { describe, it, expect } from "@jest/globals";
import WorkbenchEntity from "../../../src/domain/entities/workbench.entity.js";
import { InvalidInputError } from "../../../src/domain/errors/index.js";

describe("WorkbenchEntity", () => {
  const validWorkbenchData = {
    _id: "wb123",
    name: "Development Workspace",
    description: "Main workspace for dev",
    owner: "user123",
    members: [{ userId: "user123", role: "owner" }],
    settings: { theme: "dark" },
    isArchived: false,
  };

  it("should create a valid workbench", () => {
    const workbench = new WorkbenchEntity(validWorkbenchData);

    expect(workbench.id).toBe(validWorkbenchData._id);
    expect(workbench.name).toBe(validWorkbenchData.name);
    expect(workbench.owner).toBe(validWorkbenchData.owner);
  });

  it("should throw error if name is missing", () => {
    const { name, ...dataWithoutName } = validWorkbenchData;
    expect(() => new WorkbenchEntity(dataWithoutName)).toThrow(
      InvalidInputError,
    );
  });

  it("should manage members correctly", () => {
    const workbench = new WorkbenchEntity(validWorkbenchData);
    expect(workbench.members.length).toBe(1);

    workbench.addMember("user456", "editor");
    expect(workbench.members.length).toBe(2);
    expect(workbench.members[1].userId).toBe("user456");

    workbench.removeMember("user456");
    expect(workbench.members.length).toBe(1);
  });

  it("should return sanitized data", () => {
    const workbench = new WorkbenchEntity(validWorkbenchData);
    const sanitized = workbench.sanitized();

    expect(sanitized.id).toBe(validWorkbenchData._id);
    expect(sanitized.name).toBe(validWorkbenchData.name);
  });

  it("should return a plain object via toObject()", () => {
    const workbench = new WorkbenchEntity(validWorkbenchData);
    const obj = workbench.toObject();

    expect(obj.name).toBe(validWorkbenchData.name);
    expect(obj.owner).toBe(validWorkbenchData.owner);
  });
});

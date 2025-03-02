import React from "react";
import * as mockData from "../../data/mockdata";

describe("Mock Data", () => {
  test("mockDataTeam contains the expected structure", () => {
    expect(mockData.mockDataTeam).toBeDefined();
    expect(Array.isArray(mockData.mockDataTeam)).toBe(true);

    // Check the first item has required properties
    if (mockData.mockDataTeam.length > 0) {
      const firstItem = mockData.mockDataTeam[0];
      expect(firstItem).toHaveProperty("id");
      expect(firstItem).toHaveProperty("authorized");
      expect(firstItem).toHaveProperty("apiKeyUsage");
    }
  });

  test("mock data contains at least one authorized and one unauthorized user", () => {
    const authorizedUsers = mockData.mockDataTeam.filter(
      (user) => user.authorized === true
    );
    const unauthorizedUsers = mockData.mockDataTeam.filter(
      (user) => user.authorized === false
    );

    expect(authorizedUsers.length).toBeGreaterThan(0);
    expect(unauthorizedUsers.length).toBeGreaterThan(0);
  });
});

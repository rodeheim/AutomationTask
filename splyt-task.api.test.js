const request = require("supertest");
const url = "https://qa-interview-test.qa.splytech.dev";

describe("Splyt Task API test case", () => {
  it("should return all information from the id", async () => {
    const requestBody = {
      departure_date: "2025-02-24T16:40:58.000Z",
      pickup: {
        latitude: 51.5,
        longitude: -0.15,
      },
      passenger: {
        name: "Elton John",
        phone_number: "90234",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    const journey_id = response.body._id.toString();
    const responseURL = await request(url).get(`/api/journeys/${journey_id}`);
    expect(responseURL.status).toBe(200);
    expect(responseURL.body).toStrictEqual({
      _id: `${journey_id}`,
      pickup: {
        latitude: 51.5,
        longitude: -0.15,
      },
      departure_date: "2025-02-24T16:40:58.000Z",
      passenger: {
        name: "Elton John",
        phone_number: "90234",
      },
    });
  });

  it("should return an error message when request an id without phone number", async () => {
    const requestBody = {
      departure_date: "2025-02-24T16:40:58.000Z",
      pickup: {
        latitude: 51.5,
        longitude: -0.15,
      },
      passenger: {
        name: "Elton John",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    const journey_id = response.body._id.toString();
    const responseURL = await request(url).get(`/api/journeys/${journey_id}`);
    expect(responseURL.status).toBe(400);
    expect(response.body.message).toBe("User has no phone number");
  });

  it("should start a trip", async () => {
    const requestBody = {
      departure_date: "2025-02-24T16:40:58.000Z",
      pickup: {
        latitude: 51.5,
        longitude: -0.15,
      },
      passenger: {
        name: "Elton John",
        phone_number: "90234",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.departure_date).toMatch("2025-02-24T16:40:58.000Z");
    expect(response.body.pickup.latitude).toBe(51.5);
    expect(response.body.pickup.longitude).toBe(-0.15);
    expect(response.body.passenger.name).toBe("Elton John");
    expect(response.body.passenger.phone_number).toBe("90234");
  });

  it("should have phone number as a required field", async () => {
    const requestBody = {
      departure_date: "2025-02-24T16:40:58.000Z",
      pickup: {
        latitude: 51.5,
        longitude: -0.15,
      },
      passenger: {
        name: "Elton John",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("request failed body validation");
  });

  it("should have name as a required field", async () => {
    const requestBody = {
      departure_date: "2225-02-24T16:40:58.000Z",
      pickup: {
        latitude: 51.5,
        longitude: -0.15,
      },
      passenger: {
        phone_number: "90234",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("request failed body validation");
  });

  it("should have pickup as a required field", async () => {
    const requestBody = {
      departure_date: "2225-02-24T16:40:58.000Z",
      passenger: {
        name: "Elton John",
        phone_number: "90234",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("request failed body validation");
  });

  it("should have departure_date as a required field", async () => {
    const requestBody = {
      pickup: {
        latitude: 51.5,
        longitude: -0.15,
      },
      passenger: {
        name: "Elton John",
        phone_number: "90234",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("request failed body validation");
  });

  it("should return an error for incorrect format for departure_date", async () => {
    const requestBody = {
      pickup: {
        departure_date: ":2225-02-24T16:40:58.000Z",
        latitude: 51.5,
        longitude: -0.15,
      },
      passenger: {
        name: "Elton John",
        phone_number: "90234",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("request failed body validation");
  });

  it("latitude and longitude should not exceed boundaries", async () => {
    const requestBody = {
      departure_date: "2225-02-24T16:40:58.000Z",
      pickup: {
        latitude: 10000.5,
        longitude: -1000000.15,
      },
      passenger: {
        name: "Elton John",
        phone_number: "90234",
      },
    };
    const response = await request(url)
      .post("/api/journeys/")
      .send(requestBody);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("request failed body validation");
  });
});

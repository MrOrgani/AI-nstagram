import { test, expect } from "@playwright/test";

const mockedPosts = [
  {
    id: 20,
    created_at: "2023-10-09T17:28:56.472637+00:00",
    user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    prompt:
      "a cyberpunk cityscape with neon-lit streets and holographic billboards.",
    comments: 3,
    likes: 4,
    photo: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc_1696872534272",
    user: {
      created_at: "2023-09-19T06:48:09.200175+00:00",
      name: "Maxime Organi",
      email: "maxime.organi@gmail.com",
      avatar: null,
      id: 2,
      user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    },
    likedByUser: [],
  },
];

const mockedComments = [
  {
    comment_id: "07f45a1b-795b-4575-87e9-616b7fcbf1b0",
    created_at: "2023-10-11T09:49:51.106281+00:00",
    user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    text: "Testing Comments",
    post_id: 20,
    user: {
      created_at: "2023-09-19T06:48:09.200175+00:00",
      name: "Maxime Organi",
      email: "maxime.organi@gmail.com",
      avatar: null,
      id: 2,
      user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    },
  },
  {
    comment_id: "8ffbe2e6-c0b4-456c-95ed-73f88d75a586",
    created_at: "2023-10-11T12:28:17.060545+00:00",
    user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    text: "Testing a comment from Profile modal",
    post_id: 20,
    user: {
      created_at: "2023-09-19T06:48:09.200175+00:00",
      name: "Maxime Organi",
      email: "maxime.organi@gmail.com",
      avatar: null,
      id: 2,
      user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    },
  },
  {
    comment_id: "8bc5489f-4803-4a76-82e7-1c710f12954c",
    created_at: "2023-10-11T13:28:34.053184+00:00",
    user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    text: "Comment 3",
    post_id: 20,
    user: {
      created_at: "2023-09-19T06:48:09.200175+00:00",
      name: "Maxime Organi",
      email: "maxime.organi@gmail.com",
      avatar: null,
      id: 2,
      user_id: "3778c8a6-584d-44d6-9cc8-e53cfb1c05fc",
    },
  },
];

test("testing writing a comment when offline", async ({ page }) => {
  await page.route(
    "**/*/rest/v1/posts?select=*%2Cuser%3Auser_id%28*%29%2ClikedByUser%3Alikes%28id%3Auser_id%29&offset=0&limit=2&order=created_at.desc",
    async (route) => {
      const json = mockedPosts;
      await route.fulfill({ json });
    }
  );
  await page.route("**/*/functions/v1/getPostComments", async (route) => {
    const json = mockedComments;
    await route.fulfill({ json });
  });
  await page.goto("http://localhost:3000/");

  await page.getByRole("main").first().click();
  await page.locator("body").press("Meta+Shift+c");

  await expect(page.getByTestId("feed-post")).toHaveCount(1);
  await page.locator(".flex > .flex > svg:nth-child(2)").first().click();
  await page.locator("#comment_area_20").fill("Adding a comment to post");

  await page.getByText("Post").nth(1).click();
  await page
    .locator("div")
    .filter({ hasText: /^Adding a comment to postPost$/ })
    .locator("div")
    .click();
  await expect(
    page.getByText(
      "Sign in|Sign upEnter your email below to connectEmailSign In with EmailOr contin"
    )
  ).toBeVisible();

  await page.getByPlaceholder("name@example.com").click();
  await page.getByPlaceholder("name@example.com").fill("max@gmail.com");
  await page.getByPlaceholder("name@example.com").press("Tab");
  await page.getByPlaceholder("Password").fill("qwerty");
  await page.getByRole("button", { name: "Sign In with Email" }).click();

  await expect(page.getByRole("menubar")).toBeVisible();

  await page
    .locator("div")
    .filter({ hasText: /^Adding a comment to postPost$/ })
    .locator("div")
    .click();

  await expect(page.getByTestId("view-all-comments")).toBeVisible();
  await expect(page.getByTestId("view-all-comments")).toContainText("4");
});
test("testing displaying comments and adding one", async ({ page }) => {
  await page.route(
    "**/*/rest/v1/posts?select=*%2Cuser%3Auser_id%28*%29%2ClikedByUser%3Alikes%28id%3Auser_id%29&offset=0&limit=2&order=created_at.desc",
    async (route) => {
      const json = mockedPosts;
      await route.fulfill({ json });
    }
  );
  await page.route(
    "https://puomgptoybylltfvhahf.supabase.co/functions/v1/getPostComments",
    async (route) => {
      const json = mockedComments;
      await route.fulfill({ json });
    }
  );
  await page.route(
    "https://puomgptoybylltfvhahf.supabase.co/functions/v1/commentPost",
    async (route) => {
      await route.fulfill({ json: {} });
    }
  );
  await page.goto("http://localhost:3000/");

  await page.getByRole("main").first().click();

  await expect(page.getByTestId("feed-post")).toHaveCount(1);

  await expect(page.getByTestId("view-all-comments")).toBeVisible();
  const currentNumberOfComments = (
    await page.getByTestId("view-all-comments").innerText()
  ).match(/\d+/)?.[0];
  console.log("nbOfComments", currentNumberOfComments);
  await page.getByTestId("view-all-comments").click();

  if (!currentNumberOfComments) {
    throw new Error("no comments");
  }

  await page.locator(".flex > .flex > svg:nth-child(2)").first().click();
  await page.locator("#comment_area_20").fill("Adding a comment to post");
  await page.getByText("Post").nth(1).click();

  await page
    .locator("div")
    .filter({ hasText: /^Adding a comment to postPost$/ })
    .locator("div")
    .click();
  await expect(
    page.getByText(
      "Sign in|Sign upEnter your email below to connectEmailSign In with EmailOr contin"
    )
  ).toBeVisible();

  await page.getByPlaceholder("name@example.com").click();
  await page.getByPlaceholder("name@example.com").fill("max@gmail.com");
  await page.getByPlaceholder("name@example.com").press("Tab");
  await page.getByPlaceholder("Password").fill("qwerty");
  await page.getByRole("button", { name: "Sign In with Email" }).click();

  await expect(page.getByRole("menubar")).toBeVisible();

  await page
    .locator("div")
    .filter({ hasText: /^Adding a comment to postPost$/ })
    .locator("div")
    .click();

  await expect(page.getByTestId("comments-on-post")).toHaveCount(
    parseInt(currentNumberOfComments) + 1
  );
});

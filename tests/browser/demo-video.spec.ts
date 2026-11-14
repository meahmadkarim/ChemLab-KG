import { test, expect } from "@playwright/test";
import { siteConfig } from "../../src/config/site";
import en from "../../src/i18n/dictionaries/en.json";
import ru from "../../src/i18n/dictionaries/ru.json";
import ky from "../../src/i18n/dictionaries/ky.json";

test("dismissal survives public navigation and language switches", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation links");
  await page.goto("/en");
  const notice = page.getByRole("dialog");
  await notice.getByRole("button", { name: "Close" }).click();
  for (const section of ["experiments", "students", "teachers", "about"]) {
    const path = `/en/${section}`;
    await page.locator(`a[href="${path}"]:visible`).first().click();
    await expect(page).toHaveURL(new RegExp(path + "$"));
    await expect(notice).toBeHidden();
  }
  for (const [locale, title] of [["ru", "Русский"], ["ky", "Кыргызча"]]) {
    await page.getByTitle(title, { exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/about$`));
    await expect(notice).toBeHidden();
  }
});

for (const [role, root, sections] of [
  ["Student", "me", ["learning", "classrooms", "assignments", "profile"]],
  ["Teacher", "teacher-dashboard", ["classrooms", "assignments", "progress", "resources", "profile"]],
] as const) {
  test(`${role} dashboard document lifecycle`, async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop dashboard navigation");
    await page.goto("/en/login");
    const notice = page.getByRole("dialog");
    await notice.getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: role + " Demo", exact: true }).click();
    await expect(page).toHaveURL(new RegExp("/" + root + "$"));
    await page.reload();
    await notice.getByRole("button", { name: "Close" }).click();
    for (const section of sections) {
      const path = `/en/${root}/${section}`;
      await page.locator(`a[href="${path}"]:visible`).first().click();
      await expect(page).toHaveURL(new RegExp(path + "$"));
      await expect(notice).toBeHidden();
    }
    await page.reload();
    await expect(notice).toBeVisible();
  });
}

for (const [locale, dict] of Object.entries({ en, ru, ky })) {
  test(`direct entry, keyboard, refresh and video in ${locale}`, async ({ page, context }) => {
    const path = locale === "en" ? "/en/login" : `/${locale}/experiments/red-cabbage-ph-indicator`;
    await page.goto(path);
    const dialog = page.getByRole("dialog", { name: dict.demoVideoNotice.title });
    await expect(dialog).toHaveAccessibleDescription(dict.demoVideoNotice.message);
    const watch = dialog.getByRole("link", { name: dict.demoVideoNotice.watch });
    await expect(dialog.getByRole("button")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(watch).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.locator("body")).not.toBeFocused();
    await page.reload();
    await expect(watch).toBeVisible();
    await page.screenshot({ path: test.info().outputPath("notice.png") });
    await expect(watch).toHaveAttribute("href", siteConfig.demoVideoUrl);
    await context.route(siteConfig.demoVideoUrl, route => route.fulfill({ body: "Video destination" }));
    const opened = context.waitForEvent("page");
    await watch.click();
    await expect(await opened).toHaveURL(siteConfig.demoVideoUrl);
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(new RegExp(path + "$"));
  });
}

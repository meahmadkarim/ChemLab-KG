import { test, expect } from "@playwright/test";
test("public quiz checks answers on the server and shows the final score",async({page})=>{
 const errors:string[]=[];page.on("pageerror",error=>{errors.push(error.message);console.log("Browser error:",error.message)});
 await page.goto("/en/experiments/red-cabbage-ph-indicator?tab=quiz");
 await expect(page.getByRole("radiogroup")).toBeVisible();
 await page.getByRole("radio").nth(1).click();await page.getByRole("button",{name:"Check Answer",exact:true}).click();
 await expect(page.getByRole("button",{name:/Next Question/})).toBeVisible();
 await page.getByRole("button",{name:/Next Question/}).click();
 await page.getByRole("radio").nth(0).click();await page.getByRole("button",{name:"Check Answer",exact:true}).click();
 await page.getByRole("button",{name:/See Final Score/}).click();
 await expect(page.getByRole("heading",{name:"Experiment Check Complete!"})).toBeVisible();
 await expect(page.getByText(/2.*2/).first()).toBeVisible();
 expect(errors).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await page.screenshot({path:`test-results/quiz-${test.info().project.name}.png`,fullPage:true});
});
test("demo teacher signs in and cannot enter administrator pages",async({page})=>{
 await page.goto("/en/login");await page.getByRole("button",{name:"Teacher Demo",exact:true}).click();
 await expect(page).toHaveURL(/teacher-dashboard/);
 await page.goto("/en/admin");await expect(page).not.toHaveURL(/\/admin(?:$|\?)/);
 await expect(page.getByRole("heading").first()).toBeVisible();
 await page.screenshot({path:`test-results/teacher-${test.info().project.name}.png`,fullPage:true});
});

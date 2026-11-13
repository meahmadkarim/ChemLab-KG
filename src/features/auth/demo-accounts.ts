import type { SessionUser } from "./server-session";
interface ServerAccountRecord extends SessionUser { passwordHash: string }
const DEMO_ACCOUNTS: ServerAccountRecord[] = [
  {
    id: "usr-student-demo",
    name: "Aibek Kadyrov",
    email: "student@chemlab.kg",
    role: "student",
    school: "Naryn Secondary School #2",
    isDemo: true,
    passwordHash: "chemlab123",
  },
  {
    id: "usr-teacher-demo",
    name: "Aigul Asanova",
    email: "teacher@chemlab.kg",
    role: "teacher",
    school: "Naryn Lyceum",
    isDemo: true,
    passwordHash: "chemlab123",
  },
];


export function demoLogin(email: string, password: string): SessionUser | null {
 const account = DEMO_ACCOUNTS.find(a => a.email === email && a.passwordHash === password);
 if (!account) return null;
 const { passwordHash: _, ...user } = account;
 void _;
 return user;
}

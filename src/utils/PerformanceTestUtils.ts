export const executeAndCalculateTime = <T>(functionToExecute: any, name?: string):T => {
  console.log("Executing function " + name);
  const t1 = new Date();
  const result = functionToExecute();
  const t2 = new Date();
  const diff = (t2.getTime() - t1.getTime())/1000;
  console.log(`Function executed in ${diff} s\n`);
  return result;
}

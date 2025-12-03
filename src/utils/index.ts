export const delay = async (ms:number) => new Promise((resolve:any) => {
  setTimeout(() => {
    resolve();
  }, ms);
})
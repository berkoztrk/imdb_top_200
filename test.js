import top200 from './index';


(async () => {
  const result = await top200.get();
  console.dir(result);
})();

let arr = [87, 2, 3, 14, 22, 33, 12, 21, 31, 45, 16, 74, 43, 56]

function sort(arr) {
  quikSort(arr, 0, arr.length - 1);
  return arr;
}

function quickSort(arr, start, end) {
    // 终止条件
    if (start >= end) {
        return;
    }

    // 返回 pivotIndex
    let index = partition(arr, start, end);
    // 将相同的逻辑递归地用于左右子数组
    quickSort(arr, start, index - 1);
    quickSort(arr, index + 1, end);
}

function partition(arr, start, end) {
  // 以最后一个元素为基准
  const pivotValue = arr[end];
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      // 交换元素
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      // 移动到下一个元素
      pivotIndex++;
    }
  }

  // 把基准值放在中间
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]]
  return pivotIndex;
};
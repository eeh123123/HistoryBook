//获取一个json的长度
function getJsonLength(jsonData) {
	var jsonLength = 0;
	for(var item in jsonData) {
		jsonLength++;
	}
	return jsonLength;
}

//比较两个jsonArray的不同,其中array1是原数组，array2是修改后的数组
function ComparArray(_array1, _array2) {
	let array1 = JSON.parse(JSON.stringify(_array1));
	let array2 = JSON.parse(JSON.stringify(_array2));

	let update_flag = true;
	let array_update = []
	let array_update_str = []
	for(let i = 0; i < array1.length; i++) {
		for(let j in array1[i]) {
			if(array1[i][j] != array2[i][j]) {
				for(let k = 0; k < array_update.length; k++) {
					if(array_update[k].id == array2[i].id) {
						update_flag = false
					}
				}
				if(update_flag == true) {
					array_update.push({
						id: array2[i].id
					})
				}

				//上面这个for循环和if是为了判断需不需要新增id

				for(let k = 0; k < array_update.length; k++) {
					if(array_update[k].id == array2[i].id) {
						array_update[k][j] = array2[i][j]
					}
				}
				update_flag = true;
			}
		}
	}
}
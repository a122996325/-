//生成左侧树状菜单
function createTreeHtml(datas,currentId) {
    var str = '';
    for (var i = 0;i<datas.length;i++) {
        if(datas[i].check)continue;
        var padNum = wy.getParentsById(data,datas[i].id).length;
        str += `<li>
                    <h3 class="${datas[i].id == currentId ? 'active' : ''}" data-pid="${datas[i].pid}" data-id="${datas[i].id}" data-checked="${datas[i].check}">
                        <i class="active" data-id="${datas[i].id}"  data-pid="${datas[i].pid}" data-checked="${datas[i].check}"></i>
                        <span class="active" data-id="${datas[i].id}" data-pid="${datas[i].pid}"  data-checked="${datas[i].check}"></span>
                        <strong class="active" data-id="${datas[i].id}" data-pid="${datas[i].pid}"  data-checked="${datas[i].check}">${datas[i].name}</strong>
                    </h3>`
        if (datas[i].child) {
            str += '<ul>' + createTreeHtml(datas[i].child,currentId) + '</ul>';
        }
    }
    str+='</li>';
    return str;
}
//生成右侧文件夹区域
function createFolderHtml(datas,ID) {
    var str = '';
    for (var i = 0;i<datas.length;i++){
        str += `<div class="file_boxWrap" data-id="${datas[i].id}">
                    <span class="check"></span>
                    <div class="file_img" data-id="${datas[i].id}"></div>
                    <div class="file_changeName">
                        <div class="text">${datas[i].name}</div>
                        <input type="text" value="">
                    </div>
                </div>`
    }
    return str;
}

//新建一个文件夹
function createNewDir() {
    var newDir = document.createElement('div');
    newDir.classList.add('file_boxWrap');
    newDir.id = ++(user_date_id.maxId);
    newDir.innerHTML = `<span class="check"></span>
                    <div class="file_img" data-id="${user_date_id.maxId}"></div>
                    <div class="file_changeName">
                        <div class="text"></div>
                        <input type="text" value="">
                    </div>`;
    return newDir;
}
//生成面包屑导航栏
function createBreadHtml(datas,currentId) {
    var _parents = wy.getParentsById(datas, currentId).reverse();
    var str = '';
    for (var i=0;i<_parents.length;i++){
        str += `<li data-id="${_parents[i].id}">${_parents[i].name}/</li>`;
    }
    return str;
}

//创建新建文件夹的数据
function addNewDirDate(textVal) {
    var newDir = {
        name: textVal,
        id:`${user_date_id.maxId}`*1,
        pid:`${numID}`*1,
        check:false,
        time:Date.now(),
        child:[]
    }
    return newDir;
}
// function nameCanUse(textVal,mainInputs) {
//     if (textVal === ''){
//         createHtml(data,numID);
//     }else{
//         for (var i=1;i<mainInputs.length;i++){
//             if (textVal ==mainInputs[i].value){
//                 console.log('命名重复')
//                 main.children[0].querySelector('input').select();
//                 break;
//             }else{
//                  console.log('可用')
//                 wy.getDateById(data,numID).child.unshift(addNewDirDate());
//                 console.log(mainInputs.length,data)
//                 createHtml(data,numID);
//                 break;
//             }
//         }
//     }
// }






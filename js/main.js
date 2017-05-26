var list = document.querySelector('.list');

var main = document.querySelector('.main');

var mainHead = document.querySelector('.main_head');


var newDir = document.querySelector('.newDir');

var help = document.querySelector('.help');

var delete_ = document.querySelector('.delete') ;

var rename = document.querySelector('.rename');

var move = document.querySelector('.move');

var tip = document.querySelector('.tip')

//初始化界面
var numID = 0;
var currentData = null;

 currentData =  createHtml(data,numID);
createHtml(data,numID);


//获取全选按钮
var allChecked = document.querySelector('.content_main').firstElementChild;


function createHtml(data,ID) {
    // console.log(createFolderHtml(newData,ID))
    viewTreeHtml(data, ID);
    viewBreadHtml(data,ID);
    return createFoldersHtml(data,ID);
}
function viewTreeHtml(data,ID) {
    list.innerHTML = createTreeHtml(data,ID);
}
function viewBreadHtml(data,ID) {
    mainHead.innerHTML =  createBreadHtml(data,ID);
}
function createFoldersHtml(data,ID) {
    var  child = wy.getChildrenById(data, ID);
    main.innerHTML = createFolderHtml(child,ID);
    return child;
}
//点击树状菜单进入
list.onclick = function (e) {
    var target = e.target;
    var id = target.dataset.id*1;
    if (numID == id) return;
    if (target.nodeName.toUpperCase() == 'H3'||target.classList.contains('active')){
        numID = target.dataset.id*1;
        closeAllCheck();
        currentData = createHtml(data,numID)
    }
};
//点击右侧文件夹进入
 main.ondblclick = function (e) {
    var target = e.target;
     var id = target.dataset.id*1;
     if (numID == id) return;
    if (target.classList.contains('file_img')||target.classList.contains('file_boxWrap')){
        numID = target.dataset.id*1;
        closeAllCheck()
        currentData = createHtml(data,numID)
    }

 };
 //点击面包屑导航栏进入
mainHead.onclick = function (e) {
    var target = e.target;
    var id = target.dataset.id*1;
    if (numID == id) return;
    if (target.nodeName.toUpperCase() =='LI'){
        numID = target.dataset.id*1;
        closeAllCheck()
        currentData = createHtml(data,numID)
    }
};
//点击新建按钮新建文件夹
newDir.onclick = function () {
    closeAllCheck();
    main.insertBefore(createNewDir(),main.firstElementChild);
    main.firstElementChild.querySelector('.text').style.display = 'none';
    main.firstElementChild.querySelector('input').style.display = 'inline-block';
    main.firstElementChild.querySelector('input').focus();
    //失去焦点判断是否创建
    main.children[0].querySelector('input').onblur = function () {
        var textVal = this.value.trim();
        if (textVal === ''){
             //console.log('没起名字')
            tipMove(tip,'red','无命名，文件夹创建失败')
            currentData =createHtml(data,numID);
        }else{
            if(!nameCanUse(currentData,textVal)){
                //console.log('名字重复了');
                tipMove(tip,'red','命名冲突')
                this.select();
            }else{
                //console.log('名字可用');
                tipMove(tip,'green','文件夹创建成功')
                wy.getChildrenById(data, numID).unshift(addNewDirDate(textVal));
                main.firstElementChild.querySelector('.text').innerHTML = textVal;
                currentData = createHtml(data,numID);
            }
        }
    };
    // 回车键
    window.onkeydown = function (e){
        if(e.keyCode === 13 && main.children[0].querySelector('input').value !== ''){
            main.children[0].querySelector('input').blur();
        }
    };
};
//选择文件夹（全选，单选）
main.onclick = function (e) {
    var target = e.target;
    if (target.nodeName.toUpperCase() ==='SPAN'){
        itemIsCheck(target,numID)
        if (isCheckedAll(data,numID)){
            //console.log('全选了');
            allChecked.classList.add('add');
        }else{
            //console.log('没全选');
            allChecked.classList.remove('add');
        }
    }
    if (target.classList.contains('text')){
        var prevVal = target.innerHTML;
        target.nextElementSibling.style.display = 'inline-block';
        target.style.display = 'none';
        target.nextElementSibling.select();
        target.nextElementSibling.onblur = function () {
            var textVal = this.value.trim();
            if (prevVal == textVal ||textVal ==''){
                console.log('取消命名')
                target.style.display = 'block';
                this.style.display = 'none';
                return;
            }
            if (nameCanUse(currentData,textVal)){
                console.log('名字可用')
                target.style.display = 'block';
                target.innerHTML = textVal;
                this.style.display = 'none'
                wy.getDateById(currentData,this.parentNode.parentNode.dataset.id*1).name = textVal;
            }else{
                console.log('名字重复');
                this.select();
            }
        }
    }
}

//点击全选按钮
allChecked.onclick = function () {
    this.classList.toggle('add');
    for (var i=0;i<currentData.length;i++){
        if (this.classList.contains('add')){
            currentData[i].check = true;
            main.children[i].classList.add('active');
        }else{
            currentData[i].check = false;
            main.children[i].classList.remove('active');
        }
    }
};


//选中文件夹
function itemIsCheck(ele,id) {
    ele.parentNode.classList.toggle('active');
    if (ele.parentNode.classList.contains('active')){
        //console.log('选中了')
        wy.getDateById(data,ele.parentNode.dataset.id*1).check = true;

    }else{
        //console.log('没选中')
        wy.getDateById(data,ele.parentNode.dataset.id*1).check = false;
    }
}

//点击删除按钮删除对应视图及数据
delete_.onclick = function () {
    if (isCheckedFile(currentData).length==0){
         //console.log('没选东西')
         tipMove(tip,'red','没有选中文件夹')
        return;
    }
    console.log('选择正确，可以进行删除')
    tipMove(tip,'green','删除成功')
    // for (var i = 0;i<currentData.length;i++){
    //     currentData.splice(wy.getIndexById(currentData,isCheckedFile(currentData)[i].id),1)
    // }
    deleteItem(currentData);
    currentData =createHtml(data,numID);
    console.log(currentData)
    if (!currentData.length){
        closeAllCheck()
    }
};

//点击重命名按钮 重新进行命名并修改数据
rename.onclick = function () {
    if (isCheckedFile(currentData).length==0){
         //console.log('没选东西')
         tipMove(tip,'red','请选择文件')
    }
    if (isCheckedFile(currentData).length > 1){
         //console.log('选的太多了')
         tipMove(tip,'red','只能同时选取一个文件')
    }
    if(isCheckedFile(currentData).length === 1){
         //console.log('选择正确，可以进行改名')
        for (var i=0;i<main.children.length;i++){
            if (main.children[i].dataset.id*1===isCheckedFile(currentData)[0].id){
                main.children[i].querySelector('input').style.display = 'inline-block';
                main.children[i].querySelector('input').value = main.children[i].querySelector('.text').innerHTML;
                main.children[i].querySelector('.text').style.display = 'none'
                main.children[i].querySelector('input').select()
                var prevVal = main.children[i].querySelector('input').value;
                main.children[i].querySelector('input').onblur = function () {
                    var textVal = this.value.trim();
                    if (prevVal ==textVal){
                        //console.log('取消命名')
                        tipMove(tip,'red','取消命名')
                        this.previousElementSibling.style.display = 'block';
                        this.style.display = 'none';
                        this.parentNode.parentNode.classList.remove('active');
                        wy.getDateById(currentData,this.parentNode.parentNode.dataset.id*1).check = false;
                        return;
                    }
                    if (nameCanUse(currentData,textVal)){
                        //console.log('名字可用')
                        tipMove(tip,'green','重命名成功')
                        this.previousElementSibling.innerHTML = textVal;
                        this.previousElementSibling.style.display = 'block';
                        this.style.display = 'none';
                        wy.getDateById(currentData,this.parentNode.parentNode.dataset.id*1).name = textVal;
                        this.parentNode.parentNode.classList.remove('active');
                        wy.getDateById(currentData,this.parentNode.parentNode.dataset.id*1).check = false;
                    }else{
                        //console.log('名字重复');
                        tipMove(tip,'red','重命名冲突')
                        this.select();
                    }
                }
            }
        }
    }
};
//先生成移动里面的结构
var moveList = document.querySelector('.move_list');
var zheZhao = document.querySelector('.zhezhao');
//点击移动按钮进行移动
move.onclick = function () {

    // if(isNameIng) return;
    if (!isCheckedFile(currentData).length){
        tipMove(tip,'red','请选择文件夹')
    }
    if (isCheckedFile(currentData).length){
        zheZhao.style.display = 'block';
        fq.animation(zheZhao,{opacity: 1},function () {
            fq.animation(moveList,{width: 410},600)
        })
        moveList.innerHTML = createTreeHtml(data,numID);
    }
    document.onclick = function (e) {
        var target = e.target;
        var id = target.dataset.id*1;
        if (target.nodeName.toUpperCase() == 'H3'||target.classList.contains('active')){
            if (id ===numID){
                console.log('取消移动')
                tipMove(tip,'red','已取消文件移动')
                return;
            }
            var checkedArr = isCheckedFile(currentData);
            var children = wy.getChildrenById(data,id)
            for (var i = 0; i < checkedArr.length; i++) {
                if(!nameCanUse(children,checkedArr[i].name)){
                    console.log('重名了')
                    tipMove(tip,'red','所移动文件夹有重名文件')
                    return;
                }
            }
            console.log('可以移动')
            deleteItem(currentData)
            for (var i=0;i<checkedArr.length;i++){
                wy.getChildrenById(data,id).unshift(checkedArr[i])
                checkedArr[i].pid = id;
                checkedArr[i].check = false;
            }
            fq.animation(moveList,{width: 0,},function () {
                fq.animation(zheZhao,{opacity: 0,})
            })
            zheZhao.style.display = 'none';
             currentData = createHtml(data,numID);
             tipMove(tip,'green','文件夹移动成功')
        }
    };
    var close = document.querySelector('.close');
    close.onclick = function () {
        fq.animation(zheZhao,{opacity: 0,},function () {
            this.style.display = 'none';
        })
        closeAllCheck();
    }













};
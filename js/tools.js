
    var wy = {};
//获取到为id的数据
    wy.getDateById = function (data,ID){
        var item = null;
        for (var i=0;i<data.length; i++){
            if (data[i].id === ID){
                item = data[i];
                break;
            }
            if (data[i].child && !item){
                item = this.getDateById(data[i].child, ID);
                if (item){
                    break;
                }
            }
        }
        return item;
    };
    //获取为ID下一层的数据
    wy.getChildrenById = function (data,ID) {
        var targetDate = this.getDateById(data,ID);
        if (targetDate && targetDate.child){
            return targetDate.child;
        }
    };
    //通过制定ID获取到自己以及自己所有的父级
    wy.getParentsById = function (data,ID) {
        var items = [];
        var current = this.getDateById(data,ID);
        if (current){
            items.push(current);
            items = items.concat(this.getParentsById(data,current.pid ))
        }
        return  items;
    };


    //判断名字是否可用
    function nameCanUse(data,val) {
        for(var i=0; i<data.length; i++){
            if(data[i].name === val){
                return false;
            }
        }
        return true;
    }


    //判断是否都选中了
    function isCheckedAll(data,id) {
        for (var i=0;i<wy.getChildrenById(data,id).length;i++){
            if (!wy.getChildrenById(data,id)[i].check){
                //console.log('没全选')
                return false;
            }
        }
        //console.log('全选了')
        return true;
    }

    //关闭全选功能
    function closeAllCheck() {
        allChecked.classList.remove('add');
        for (var i=0;i<currentData.length;i++){
            currentData[i].check = false;
            main.children[i].classList.remove('active');
        }
    }

    // 获取被选中的数据
    function isCheckedFile(data){
        var arr = [];
        for(var i=0; i<data.length; i++){
            if(data[i].check){
                arr.push(data[i]);
            }
        }
        return arr;
    }

    //通过id找到该id数据在其父级child的索引
    wy.getIndexById = function (data,ID) {
        var n = -1;
        for (var i=0;i<data.length;i++){
            n++;
            if (data[i].id === ID){
                break;
            }
        }
        return n;
    };
    function deleteItem(data) {
        for (var i=0;i<data.length;i++){
            if (data[i].check){
                data.splice(i, 1)
                --i;
            }
        }
    }

    function tipMove(obj,color,inner){
        obj.style.background = color;
        obj.innerHTML = inner;
        fq.animation(obj,{'top':5},function(){
            setTimeout(function(){
                fq.animation(obj,{'top':-52})
            },3000)
        })
    }








































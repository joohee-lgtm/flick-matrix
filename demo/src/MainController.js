var DIRECTION = {
    "PREV" : "4",
    "NEXT" : "2",
    "DOWN" : "8",
    "UP" : "16"
};


var Model = function(conf) {
    var setting = {
        url : "101data_test.json",
        //url : "101data.json",
        dataType : "json"
    };
    $.ajax(setting)
        .success($.proxy(function (data) {
            this.data = data.result;
            conf.success();
        }, this));
};

Model.prototype = {
    getForwordData : function(column, row){
        var forword = [
            [{},{},{}],
            [{},{},{}],
            [{},{},{}]
        ];
        if(!isNaN(column) && !isNaN(row)){
            var columns = this.getArrays(column, this.data);
            forword[0] = this.getArrays(row, columns[0]);
            forword[1] = this.getArrays(row, columns[1]);
            forword[2] = this.getArrays(row, columns[2]);
            return forword;
        }
        if(parseInt(column, 10)){
            return this.data[column];
        }
        return this.data;
    },


    getArrays : function(idx, arr){
        return [
            this.getPrevArray(idx, arr),
            arr[idx],
            this.getNextArray(idx, arr)
        ]
    },

    getPrevArray : function(idx, arr){
        var prev = idx-1;
        if(prev < 0){
            return arr[arr.length-1];
        }
        return arr[prev];
    },

    getNextArray : function(column, arr){
        var next = column+1;
        if(next > arr.length-1){
            return arr[0];
        }
        return arr[next];
    }
};


var View = function(conf){
    var hWrapper = $(".wrapper.horizon").get(0);

    var main = new eg.Flicking(hWrapper,{
        horizontal: false,
        circular: true
    }).on({
        "flickEnd" : $.proxy(function(we){
            this.rePannel(we.direction == DIRECTION.UP);
            conf.move(we);
        }, this)
    });

    var vWrapperPrev = main.getPrevElement().children()[0];
    var vWrapperCur = main.getElement().children()[0];
    var vWrapperNext = main.getNextElement().children()[0];

    var o1 = new eg.Flicking(vWrapperPrev, {
        horizontal: true,
        circular: true
    }).on({
        "flickEnd" : $.proxy(function(we){
            conf.move(we);
        }, this).bind()
    });

    var o2 = new eg.Flicking(vWrapperCur, {
        horizontal: true,
        circular: true
    }).on({
        "flickEnd" : $.proxy(function(we){
            conf.move(we);
        }, this).bind()
    });

    var o3 = new eg.Flicking(vWrapperNext, {
        horizontal: true,
        circular: true
    }).on({
        "flickEnd" : $.proxy(function(we){
            conf.move(we);
        }, this).bind()
    });

    this._moveComponent = [o1, o2, o3];

    this._prevComponentIdx = 0;
    this._curComponentIdx = 1;
    this._nextComponentIdx = 2;
};

View.prototype = {
    rePannel : function(moveup){
        console.log(moveup);
        var cur;
        var prev;
        var next;
        if(moveup){
            cur = this._nextComponentIdx;
            next = this._prevComponentIdx;
            prev = this._curComponentIdx;
        } else {
            cur = this._prevComponentIdx;
            next = this._curComponentIdx;
            prev = this._nextComponentIdx;
        }
        this._prevComponentIdx = prev;
        this._curComponentIdx = cur;
        this._nextComponentIdx = next;
    },

    draw :  function(data, dir){
        console.log(JSON.stringify(data[0]));
        console.log(JSON.stringify(data[1]));
        console.log(JSON.stringify(data[2]));

        var oCur = this._moveComponent[this._curComponentIdx];
        var oPrev = this._moveComponent[this._prevComponentIdx];
        var oNext = this._moveComponent[this._nextComponentIdx];

        if(dir < 0 || !dir){
            this._renderTo(oPrev.getElement(), data[0][1].video);

            this._renderTo(oCur.getPrevElement(), data[1][0].video);
            this._renderTo(oCur.getElement(), data[1][1].video);
            this._renderTo(oCur.getNextElement(), data[1][2].video);

            this._renderTo(oNext.getElement(), data[2][1].video);
        }


        if(DIRECTION.NEXT == dir){
            this._renderTo(oPrev.getElement(), data[0][1].video);
            this._renderTo(oNext.getElement(), data[2][1].video);

            this._renderTo(oCur.getNextElement(), data[1][2].video);
        }

        if(DIRECTION.PREV == dir){
            this._renderTo(oPrev.getElement(), data[0][1].video);
            this._renderTo(oNext.getElement(), data[2][1].video);

            this._renderTo(oCur.getPrevElement(), data[1][0].video);
        }

        if(DIRECTION.UP == dir){
            this._renderTo(oPrev.getPrevElement(), "");
            this._renderTo(oPrev.getNextElement(), "");

            this._renderTo(oCur.getPrevElement(), data[1][0].video);
            this._renderTo(oCur.getNextElement(), data[1][2].video);
        }

        if(DIRECTION.DOWN == dir){

        }

        //this._renderTo(oCur.getPrevElement(), data[1][0].video);
        //this._renderTo(oCur.getElement(), data[1][1].video);
        //this._renderTo(oCur.getNextElement(), data[1][2].video);
        //
        //this._renderTo(oPrev.getPrevElement() , data[0][0].video);
        //this._renderTo(oPrev.getElement() , data[0][1].video);
        //this._renderTo(oPrev.getNextElement() , data[0][2].video);
        //
        //this._renderTo(oNext.getPrevElement() , data[2][0].video);
        //this._renderTo(oNext.getElement(), data[2][1].video);
        //this._renderTo(oNext.getNextElement(), data[2][2].video);
    },

    _renderTo : function(el, data){
        var wel = $(el);
        var iframe = $(data);
        var welWidth;
        var welHeight;
        var width = 16;
        var height = 9;

        if(iframe.attr("width") && iframe.attr("height")){
            width = parseInt(iframe.attr("width"), 10);
            height = parseInt(iframe.attr("height"), 10);
        }

        welWidth = wel.width();
        welHeight = welWidth * (height/width);
        iframe.width(welWidth).height(welHeight);
        wel.html('');
        wel.html(iframe);
    }
};


function startApplication(){
    var oView;

    var column = 0;
    var row = 0;
    var LAST_COLUMN_INDEX;
    var LAST_ROW_INDEX;

    function setColumnIdx(up){
        if(up){
            column = column+1 <  LAST_COLUMN_INDEX ? column+1 : 0;
        } else {
            column = column-1 > -1 ? column-1 : LAST_COLUMN_INDEX;
        }
    }

    function setRowIdx(next){
        if(next){
            row = row+1 < LAST_ROW_INDEX+1  ? row+1 : 0;
        } else {
            row = row-1 > -1  ? row-1 : LAST_ROW_INDEX;
        }
    }

    function move(we){
        var dir = we.direction;

        if(DIRECTION.NEXT == dir){
            setRowIdx(true);
        }

        if(DIRECTION.PREV == dir){
            setRowIdx(false);
        }

        if(DIRECTION.UP == dir){
            setColumnIdx(true);
        }

        if(DIRECTION.DOWN == dir){
            setColumnIdx(false);
        }

        var data = oModel.getForwordData(column, row);
        oView.draw(data, dir);
    }


    var oModel = new Model({
        success : function(){
            LAST_COLUMN_INDEX = oModel.getForwordData().length-1;
            LAST_ROW_INDEX = oModel.getForwordData()[0].length-1;

            var data = oModel.getForwordData(column, row);
            oView = new View({
                move : move
            });
            oView.draw(data, -1);
        }
    });


}
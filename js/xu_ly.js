document.querySelector("#file-input").addEventListener('change', function() {
    $("#chon_file").hide();
    
    // files that user has chosen
    var all_files = this.files;
    if(all_files.length == 0) {
        alert('Error : No file selected');
        return;
    }

    // first file selected by user
    var file = all_files[0];

    // files types allowed
    var allowed_types = [ 'text/plain' ];
    if(allowed_types.indexOf(file.type) == -1) {
        alert('Error : Incorrect file type');
        return;
    }

    // Max 2 MB allowed
    var max_size_allowed = 2*1024*1024
    if(file.size > max_size_allowed) {
        alert('Error : Exceeded size 2MB');
        return;
    }

    // file validation is successfull
    // we will now read the file

    var reader = new FileReader();

    // file reading finished successfully
    reader.addEventListener('load', function(e) {
        var text = e.target.result;
        var res = text.split('\n');
        $("#f_du_doan").show();
        
        data = gen_data_array(res);

    });

    // file reading failed
    reader.addEventListener('error', function() {
        alert('Error : Failed to read file');
    });

    // read as text file
    reader.readAsText(file);
});

// Tạo mảng object từ dữ liệu thô đọc được.
function gen_data_array(raw_data) {

    var D = [];

    attr_name = [];

    gen_data_select(raw_data);

    for (let i = 2; i < raw_data.length; i++) {
        var line = raw_data[i].split('\t');
        var name = line.splice(0,1)[0];
        attr_name.push(name);
        D.push(line);
    }

    D.splice(-1,1);
    attr_name.splice(-1,1);
    return D;
}

function gen_data_select(raw_data) {

    var title = raw_data[1].split("\t");    

    for (let index = 0; index < title.length-1; index++) {
        const element = title[index];
        if (attr_name[index] == 'name') {
            continue;
        }

        if (attr_name[index] == 'legs') {
            $("#div_du_doan").append('\
                <div class="form-group col-sm-3 text-left">\
                    <label>'+element+'</label>\
                    <select class="form-control" name="sl_'+index+'" id="sl_'+index+'">\
                        <option value="0">0</option>\
                        <option value="2">2</option>\
                        <option value="4" selected>4</option>\
                        <option value="5">5</option>\
                        <option value="6">6</option>\
                        <option value="8">8</option>\
                    </select>\
                </div>\
            ');
            continue;
        }

        if (attr_name[index] == 'class') {
            $("#div_du_doan").append('\
                <div class="form-group col-sm-3 text-left">\
                    <label>'+element+'</label>\
                    <select class="form-control" name="sl_'+index+'" id="sl_'+index+'">\
                        <option value="1" selected>Động vật có vú</option>\
                        <option value="2">Chim</option>\
                        <option value="3">Bò sát</option>\
                        <option value="4">Cá</option>\
                        <option value="5">Lưỡng cư</option>\
                        <option value="6">Côn trùng</option>\
                        <option value="7">Động vật không xương sống</option>\
                    </select>\
                </div>\
            ');
            continue;
        }

        $("#div_du_doan").append('\
            <div class="form-group col-sm-3 text-left">\
                <label>'+element+'</label>\
                <select class="form-control" name="sl_'+index+'" id="sl_'+index+'">\
                    <option value="1" selected>Đúng</option>\
                    <option value="0">Sai</option>\
                </select>\
            </div>\
        ');
    }
}

// Dự đoán cây quyết định.
function DTree(train, index_att) {
        
        // Configuration
        var config = {
            trainingSet: train, 
            categoryAttr: index_att
        };

        // Building Decision Tree
        var decisionTree = new dt.DecisionTree(config);
        
        var test = new Object;
        for (let i = 0; i < attr_name.length-1; i++) {
            if (attr_name[i] != index_att) {
                test[attr_name[i]] = $("#sl_" + i).val();
            }
        }
        

        var decisionTreePrediction = decisionTree.predict(test);
        alert("Con vật này là: " + decisionTreePrediction);
        
}
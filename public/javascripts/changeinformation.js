function modifyName() {
    $(".dd_modName").val($("#dd_uname").text());
}

function modifySex() {
    console.log($("#dd_usex").text());
    if ($("#dd_usex").text() == "男") {
        $("#dd_male").css("background-color", "deepskyblue");
        $("#dd_male").css("color", "white");
        $("#dd_female").css("background-color", "lightgrey");
        $("#dd_female").css("color", "#333");
    } else {
        $("#dd_female").css("background-color", "pink");
        $("#dd_female").css("color", "white");
        $("#dd_male").css("background-color", "lightgrey");
        $("#dd_male").css("color", "#333");
    }
}


function readFile(file, element) {


    var reader = new FileReader();
    switch (file.type) {
        case 'image/jpg':
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
            reader.readAsDataURL(file);
            break;
    }

    reader.addEventListener('load', function() {


        switch (file.type) {
            case 'image/jpg':
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
                var img = document.createElement('img');

                img.src = reader.result;
                element.append(img);
                element.show();
                break;
        }
    });
}


$(function() {
    $(".modal").on("show.bs.modal",
        function(event) {
            var button = $(event.relatedTarget);

            $(this).find(".modal-footer").html("");
            $(this).find(".modal-footer").append("<div class='col-xs-6 dd_addrHold'>保存</div><div class='col-xs-6 dd_addrCancel' onclick='cancel()'>取消</div>");
            $("#myModal1 .dd_addrHold").on("click", function() {
                var data = {
                    name: $(".dd_modName").val()
                };
                $.ajax({
                    type: "post",
                    url: "/users/changeuname",
                    data: data,
                    async: true,
                    success: function(item) {
                        console.log(item);
                        if (item == "login") {
                            window.location.href = "/users/login";
                        } else if (item == "person") {
                            window.location.href = "/users/person";
                        }
                    }
                });
            })

            $("#myModal2 .dd_addrHold").on("click", function() {

                if ($("#dd_male").css("background-color") == "rgb(0, 191, 255)") {

                    var data = {
                        sex: "男"
                    };
                    $.ajax({
                        type: "post",
                        url: "/users/changesex",
                        data: data,
                        async: true,
                        success: function(item) {
                            console.log(item);
                            if (item == "login") {
                                window.location.href = "/users/login";
                            } else if (item == "person") {
                                window.location.href = "/users/person";
                            }
                        }
                    });
                } else {

                    var data = {
                        sex: "女"
                    };
                    $.ajax({
                        type: "post",
                        url: "/users/changesex",
                        data: data,
                        async: true,
                        success: function(item) {
                            console.log(item);
                            if (item == "login") {
                                window.location.href = "/users/login";
                            } else if (item == "person") {
                                window.location.href = "/users/person";
                            }
                        }
                    });
                }

            })

            $("#myModal3 .dd_addrHold").on("click", function() {
                var data = {
                    pwd: $("#dd_modpassword").val()
                };
                $.ajax({
                    type: "post",
                    url: "/users/changepwd",
                    data: data,
                    async: true,
                    success: function(item) {
                        console.log(item);
                        if (item == "login") {
                            window.location.href = "/users/login";
                        } else if (item == "person") {
                            window.location.href = "/users/person";
                        }
                    }
                });
            })
        });



    $("#dd_male").on("click", function() {
        $("#dd_male").css("background-color", "deepskyblue");
        $("#dd_male").css("color", "white");
        $("#dd_female").css("background-color", "lightgrey");
        $("#dd_female").css("color", "#333");
    })

    $("#dd_female").on("click", function() {
        $("#dd_female").css("background-color", "pink");
        $("#dd_female").css("color", "white");
        $("#dd_male").css("background-color", "lightgrey");
        $("#dd_male").css("color", "#333");
    })

    $("#exampleInputFile").change(function() {
        $(".dd_userimg").empty();
        var file = this.files[0];
        readFile(file, $(".dd_userimg"));
        $("#dd_headimg cite").click();
    });


    $("#dd_headimg cite").on("click", function() {
        var formData = new FormData($("#myform")[0]);
        var url = "/users/uploader";
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(responseStr) {}
        });
    });

    cancel = function() {
        $(".close").click();
    }

});
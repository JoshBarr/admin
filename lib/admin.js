var Admin = (function(document, window) {

    var admin = {
        supportsFileAPI: function() {
            return window.File && window.FileReader && window.FileList && window.Blob;
        },
        init: function() {
            var me = this;
            if (!this.supportsFileAPI()) {
                return
            }
        
            $("[data-edit]").hide();
            $("[data-select]").show();
            $("[data-save]").on("click", $.proxy(this.handleSaveAction, this));
            $("form").on("submit", $.proxy(this.handleSave, this));

            document.getElementById('files').addEventListener('change', function(e) {
                me.handleFileSelect.call(me, e);
            }, false);

        },
        handleFileSelect: function(evt) {
            var me = this;
            var files = evt.target.files; // FileList object
            // files is a FileList of File objects. List some properties.
            var output = [];
            var $sirTrevorEl = $("[data-sir-trevor]");
            
            for (var i = 0, f; f = files[i]; i++) {
                console.log(f);
                
                if (!f.type.match('application/json')) {
                    continue;
                }

                var reader = new FileReader();

                // Closure to capture the file information.
                reader.onload = (function(theFile) {
                    return function(e) {
                      // Render thumbnail.
                      // var span = document.createElement('span');
                      // span.innerHTML = ['<img class="thumb" src="', e.target.result,
                      //                   '" title="', escape(theFile.name), '"/>'].join('');
                      // document.getElementById('list').insertBefore(span, null);

                        var obj = JSON.parse(e.target.result);
                        var meta = obj.yk_data;
                        var data = obj.data;
                        var str = JSON.stringify({data: data});

                        me.node = {
                            data: data,
                            meta: meta
                        };

                        $sirTrevorEl.before("<h2>" + meta.title  + "</h2><p>Template: " + meta.template + "</p><hr>");

                        $sirTrevorEl.val(str);
                        $("[data-edit]").show();
                        new SirTrevor.Editor({ el: $('[data-sir-trevor]') });    
                    };
                })(f);

                // Read in the image file as a data URL.
                reader.readAsText(f);
            }

            //document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        },
        handleSaveAction: function(e) {
            $("form").submit();
        },
        handleSave: function(e) {
            var self = this;
            console.log(e);

            var result = {
                yk_data: self.node.meta,
                data: {}
            };

            e.preventDefault();
            return result;
            // if (e.target.classList.contains("btn")) {
            //     e.target.innerHTML = "Saving...";
            //     setTimeout(function() {
            //         e.target.innerHTML = "Save";
            //     }, 500);
            // }

        }
    };



    $(document).ready(function() {
        admin.init();
    });

})(document, window);
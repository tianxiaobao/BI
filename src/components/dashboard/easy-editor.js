import './easy-editor.less';
const size = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 48, 60, 72, 96];
const names = ['Arial', '宋体', '黑体', 'Microsoft YaHei'];
const foreColor = ['#FF0000', '#FFFFFF', '#00FFFF', '#C0C0C0', '#0000FF', 
    '#808080', '#0000A0', '#000000', '#ADD8E6', '#FFA500', '#800080', '#A52A2A', 
    '#FFFF00', '#800000', '#00FF00', '#008000', '#FF00FF', '#808000'];
const hiliteColor = ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#0000FF', 
'#FF0000', '#151B54', ' #306754', '#8C001A', '#D4A017', '#6D6968', '#000000'];

class EasyEditor {
    constructor (id) {
        this.id = id;
        this.editor = document.getElementById(id);
        this.editor.innerHTML = this.template();
        this.bindHandle();
        this.easyEditor = $(this.editor).find('.easy-editor');
    }

    template () {
        const template = `<div class="editControls grid-stack-item-content">
                <div class="headbar layout-head">
                    <div class="btn-group">
                        <a class="btn fontSize" data-role="fontSize" href='javascript:;' title="字号">
                            <span><i class="icon-text-height"></i></span>
                            ${this.select('fontSize')}
                        </a>
                        <a class="btn fontName" data-role="fontName" href='javascript:;' title="字型">
                            <span><i class="icon-font"></i></span>
                            ${this.select('fontName')}
                        </a>
                        <a class="btn foreColor" data-role="foreColor" href='javascript:;' title="字体颜色">
                            <span><i class="icon-font-color">FC</i></span>
                            ${this.select('foreColor')}
                        </a>
                        <a class="btn hiliteColor" data-role="hiliteColor" href='javascript:;' title="背景颜色">
                            <span><i class="icon-font-color">BG</i></span>
                            ${this.select('hiliteColor')}
                        </a>
                    </div>
                    <div class='btn-group'>
                        <a class='btn' data-role='bold' href='javascript:;' title="加粗"><b>B</b></a>
                        <a class='btn' data-role='italic' href='javascript:;' title="斜体"><em>I</em></a>
                        <a class='btn' data-role='underline' href='javascript:;' title="下划线"><u><b>U</b></u></a>
                        
                    </div>
                    <div class='btn-group'>
                        <a class='btn' data-role='justifyLeft' href='javascript:;' title="居左"><i class='icon-align-left'></i></a>
                        <a class='btn' data-role='justifyCenter' href='javascript:;' title="居中"><i class='icon-align-center'></i></a>
                        <a class='btn' data-role='justifyRight' href='javascript:;' title="居右"><i class='icon-align-right'></i></a>
                    </div>
                    <div class='btn-group'>
                        <a class='btn' data-role='removeFormat' href='javascript:;' title="清除格式"><i class='icon-eraser'></i></a>
                        <a class='btn' data-role='createLink' href='javascript:;' title="链接"><i class='icon-link'></i></a>
                        <div class="link-box"><input type="text" placeholder="http://www.jd.com" class="url-text" /><button>确定</button></div>
                    </div>
                    <div class="icon"><i class="ci3"></i></div>
                </div>
            </div>
            <div class='easy-editor' contenteditable></div>`;
        return template;
    }

    select (type) {
        let template = '<div class="editor-select"><ul class="select-list">';
        if(type === 'fontSize') {
            template += this.selectList(size, type);
        } else if (type === 'fontName') {
            template += this.selectList(names, type);
        } else if (type === 'foreColor') {
            template += this.selectList(foreColor, 'color');
        } else if (type === 'hiliteColor') {
             template += this.selectList(hiliteColor, 'color');
        }
        template += '</ul></div>';
        return template;
    }

    selectList (arr, type) {
        let list = '';
        if(type !== 'color') {
            arr.forEach(item => {
                if(item === 'Microsoft YaHei') {
                    list += `<li data-value="${item}">微软雅黑</li>`;
                } else {
                    list += `<li data-value="${item}">${item}</li>`;
                }
            });
        } else {
            arr.forEach(item => {
                list += `<li data-value="${item}"><i style="background-color:${item}"></i></li>`;
            });
        }
        return list;
    }

    bindHandle () {
        const self = this;
        const btn = this.editor.querySelectorAll('a.btn');
        const $linkBox = $(this.editor).find('.link-box');
        const $editorSelect = $(this.editor).find('.editor-select');
        const $editorContent = $(this.editor).find('.easy-editor');
        $(btn).on('click', function (e) {
            self.saveSelection();
            switch($(this).data('role')) {
                case 'bold': case 'italic': case 'underline': case 'justifyLeft': 
                case 'justifyCenter': case 'justifyRight': case 'removeFormat': 
                    self.execCommand($(this).data('role'));
                    break;
                case 'fontSize': case 'fontName':  case 'foreColor': case 'hiliteColor': 
                    $('.editor-select').hide();
                    $(this).find('.editor-select').show();
                    break;
                case 'createLink':
                    $linkBox.find('input').val('');
                    $linkBox.show();
                    break;
            }
            e.preventDefault();
            e.stopPropagation();
        });

        $editorSelect.on('click', 'li', function (e) {
            const $btn = $(this).closest('.btn');
            const value = $(this).data('value');
            $(this).addClass('active').siblings().removeClass('active');
            $(this).closest('.editor-select').hide();
            self.execCommand($btn.data('role'), value);
            e.stopPropagation();
        });

        $linkBox.on('click', function (e) {e.stopPropagation();});
        $linkBox.on('click', 'button', function (e) {
            const $input = $(this).prev('input');
            self.execCommand('createLink', $input.val());
            $(this).closest('.link-box').hide();
            e.stopPropagation();
        });

        $(document).on('click', function (e) {
            $(self.editor).find('.editor-select').hide();
            $(self.editor).find('.link-box').hide();
        });
    }

    execCommand (command, param) {
        this.restoreSelection();
        if(!arguments[1]) {
            param = null;
        };
        document.execCommand(command, false, param);
        this.replace(command, param);
    }

    replace (command, param) {
        if(command === 'fontSize') {
            var fontElements = document.getElementsByTagName("font");
            for (var i = 0, len = fontElements.length; i < len; ++i) {
                if (fontElements[i].size == "7") {
                    fontElements[i].removeAttribute("size");
                    fontElements[i].style.fontSize = `${param}px`;
                }
            }
        } else if(command === 'createLink') {
            const $currEditor = $(this.editor).find('.easy-editor');
            this.bindALink($currEditor);
        }
    }

    bindALink ($currEditor) {
        const $a = $currEditor.find('a');
        Array.from($a).forEach(item => {
            $(item).attr('target', '_blank').attr('title', '点击访问链接');
            $(item).on('click', function (e) {
                window.open(this.href, '_blank');
            });
        });
    }

    restoreSelection () { //重置为上个range
        const selection = window.getSelection();
        if(EasyEditor.selectedRange) {
            try {
                selection.removeAllRanges();
            } catch(ex) {
                document.body.createTextRange().select();
                document.selection.empty();
            };
            selection.addRange(EasyEditor.selectedRange);
        }
    }

    saveSelection () {
        EasyEditor.selectedRange = this.getCurrentRange();
    }

    getCurrentRange () {
        //获取当前range
        if(window.getSelection) {
            var sel = window.getSelection();
            if(sel.rangeCount > 0){
                return sel.getRangeAt(0);
            }
            
        } else if(document.selection) {
            var sel = document.selection;
            return sel.createRange();
        }
        return null;
    }

    setCursorEnd (elem) {
        if(window.getSelection) {
            elem.focus();
            var range = window.getSelection();
            range.selectAllChildren(elem);
            range.collapseToEnd();
        } else if(document.selection) {
            var range = document.selection.createTextRange();
            range.moveToElementText(elem);
            range.collapse(false);
            range.select();
        }
    }


    formatHtml () {
        return $(this.editor).find('.easy-editor').html();
    }
};
EasyEditor.selectedRange = null; 

export default {
    init (id) {
        return new EasyEditor(id);
    }
}
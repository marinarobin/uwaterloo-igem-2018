var MAXSPRITES = 100;
var MAXBITMAPS = 1e3;
var PSY_CENTRAL = -99999;
var MAX_FONTS = 100;
var psy_font_number = 0;
var psy_fonts = new Array;
var psy_fonts_size = new Array;
var PSY_VIDEO_DOUBLEBUFFER = 1;
var PSY_KEY_STATUS_CORRECT = 1;
var PSY_KEY_STATUS_WRONG = 2;
var PSY_KEY_STATUS_TIMEOUT = 3;
var psy_screen_center_x = 0;
var psy_screen_x_offset = 0;
var psy_screen_center_y = 0;
var psy_screen_y_offset = 0;
var psy_screen_width = 800;
var psy_screen_height = 600;
var psy_exp_start_time = 0;
var psy_exp_current_time = 0;
var psy_blockorder = 1;
var tablerow = 0;
var keystatus = {
    key: 0,
    status: 0,
    time: 0,
    totaltime: 0,
    mouse_x: 0,
    mouse_y: 0
};
var possiblekeys = new Array;
var mousestatus = {
    key: 0,
    status: 0,
    time: 0,
    totaltime: 0,
    x: 0,
    y: 0
};
var c = document.getElementById("exp");
var canvas_x_offset = c.getBoundingClientRect().left;
var canvas_y_offset = c.getBoundingClientRect().top;
var ctx = c.getContext("2d");
var log = document.getElementById("log");
var output = document.getElementById("Output");
outputdata = String();
var psy_bitmaps = new Array;
var bmp_number = 0;
var psy_sounds = new Array;
var psy_sound_number = 0;

function psy_load_bitmap(name) {
    psy_bitmaps[bmp_number] = new Image;
    psy_bitmaps[bmp_number].src = name;
    bmp_number++;
    return bmp_number - 1
}

function psy_load_sound(name) {
    psy_sounds[psy_sound_number] = new Audio;
    psy_sounds[psy_sound_number].src = name;
    psy_sound_number++;
    return psy_sound_number - 1
}

function psy_play(sound) {
    psy_sounds[sound - 1].play()
}

function psy_silence(sound) {
    psy_sounds[sound - 1].pause();
    psy_sounds[sound - 1].currentTime = 0
}

function psy_load_font(name, size) {
    psy_fonts[psy_font_number] = size + "pt " + name;
    psy_fonts_size[psy_font_number] = size;
    psy_font_number++;
    return psy_font_number - 1
}

function addlog(text) {
    if (log != null) {
        log.value += text + "\n";
        log.scrollTop = log.scrollHeight
    }
}

function addoutput(text) {
    if (output != null) output.value += text + "\n";
    outputdata = outputdata + text + "\n"
}

function hexrgb(r, g, b) {
    h = "#";
    if (r < 16) h = h + "0" + r.toString(16);
    else h = h + r.toString(16);
    if (g < 16) h = h + "0" + g.toString(16);
    else h = h + g.toString(16);
    if (b < 16) h = h + "0" + b.toString(16);
    else h = h + b.toString(16);
    return h
}
starttime = 0;

function psy_expect_keyboard() {
    psy_readkey.expect_keyboard = true;
    window.addEventListener("keydown", getkeydown, true);
    window.addEventListener("keyup", getkeyup, true);
    psy_readkey.keyupeventlistener = true;
    psy_readkey.keydowneventlistener = true
}

function psy_expect_mouse() {
    psy_readkey.expect_mouse = true
}

function psy_keyboard(possiblekeys, nkeys, correctkey, maxtime) {
    psy_readkey.expectedkey = possiblekeys[correctkey];
    psy_readkey.keys = possiblekeys;
    psy_expect_keyboard();
    psy_readkey.start(current_task, maxtime)
}
var psy_readkey = {
    lasttask: "",
    starttime: 0,
    readkeytimer: "",
    rt: 0,
    key: 0,
    status: 0,
    keys: [],
    expect_keyboard: false,
    expect_mouse: false,
    expectedkey: 0,
    bitmap: 0,
    bitmap_range: [-1, -1],
    mouseovereventlistener: false,
    mousedowneventlistener: false,
    keyupeventlistener: false,
    keydowneventlistener: false,
    start: function(task, maxtime) {
        psy_readkey.rt = maxtime;
        psy_readkey.key = 0;
        psy_readkey.starttime = (new Date).getTime();
        psy_readkey.lasttask = task;
        psy_readkey.readkeytimer = setTimeout("psy_readkey.timeout()", maxtime);
        keystatus.status = 3;
        keystatus.time = maxtime;
        keystatus.key = 0
    },
    stop: function() {
        clearTimeout(psy_readkey.readkeytimer);
        psy_readkey.expect_keyboard = false;
        psy_readkey.expect_mouse = false;
        if (psy_readkey.mouseovereventlistener == true) {
            window.removeEventListener("mousemove", getmouse_in_area, false);
            psy_readkey.mouseovereventlistener = false
        }
        if (psy_readkey.mousedowneventlistener == true) {
            window.removeEventListener("mousedown", getmouseclick_in_area, false);
            psy_readkey.mousedowneventlistener = false
        }
        if (psy_readkey.keyupeventlistener == true) {
            window.removeEventListener("keyup", getkeyup, false);
            psy_readkey.keyupeventlistener = false
        }
        if (psy_readkey.keydowneventlistener == true) {
            window.removeEventListener("keydown", getkeydown, false);
            psy_readkey.keydowneventlistener = false
        }
        setTimeout(psy_readkey.lasttask + ".run()", 0)
    },
    timeout: function() {
        psy_readkey.expect_keyboard = false;
        psy_readkey.expect_mouse = false;
        if (psy_readkey.mouseovereventlistener == true) {
            window.removeEventListener("mousemove", getmouse_in_area, false);
            psy_readkey.mouseovereventlistener = false
        }
        if (psy_readkey.mousedowneventlistener == true) {
            window.removeEventListener("mousedown", getmouseclick_in_area, false);
            psy_readkey.mousedowneventlistener = false
        }
        setTimeout(psy_readkey.lasttask + ".run()", 0)
    }
};
var inkeypress = 0;

function getkeydown(e) {
    inkeypress++;
    if (psy_readkey.expect_keyboard == true && inkeypress == 1 && psy_readkey.keys.indexOf(e.keyCode) > -1) {
        keystatus.time = (new Date).getTime() - psy_readkey.starttime;
        keystatus.key = e.keyCode;
        if (e.keyCode == psy_readkey.expectedkey) {
            keystatus.status = 1
        } else {
            keystatus.status = 2
        }
        psy_readkey.expect_keyboard = false;
        psy_readkey.stop()
    } else {
        inkeypress = 0
    }
}

function getkeyup(e) {
    if (inkeypress == 1) {
        keystatus.totaltime = (new Date).getTime() - psy_readkey.starttime
    }
    inkeypress = 0
}

function getmouse_in_area(e) {
    if (psy_readkey.expect_mouse == true) {
        canvas_x_offset = c.getBoundingClientRect().left;
        canvas_y_offset = c.getBoundingClientRect().top;
        tmpmouseX = e.clientX - canvas_x_offset;
        tmpmouseY = e.clientY - canvas_y_offset;
        if (tmpmouseX >= psy_stimuli1[psy_readkey.bitmap - 1].rect.x && tmpmouseX <= psy_stimuli1[psy_readkey.bitmap - 1].rect.x + psy_stimuli1[psy_readkey.bitmap - 1].rect.width && tmpmouseY >= psy_stimuli1[psy_readkey.bitmap - 1].rect.y && tmpmouseX <= psy_stimuli1[psy_readkey.bitmap - 1].rect.x + psy_stimuli1[psy_readkey.bitmap - 1].rect.height) {
            keystatus.time = (new Date).getTime() - psy_readkey.starttime;
            keystatus.status = 1;
            keystatus.mouse_x = tmpmouseX - psy_screen_x_offset;
            keystatus.mouse_y = tmpmouseY - psy_screen_y_offset;
            psy_readkey.expect_mouse = false;
            psy_readkey.stop()
        }
    }
}

function getmouseclick_in_area(e) {
    if (psy_readkey.expect_mouse == true && psy_readkey.bitmap_range[1] == -1) {
        keystatus.time = (new Date).getTime() - psy_readkey.starttime;
        canvas_x_offset = c.getBoundingClientRect().left;
        canvas_y_offset = c.getBoundingClientRect().top;
        tmpmouseX = e.clientX - canvas_x_offset;
        tmpmouseY = e.clientY - canvas_y_offset;
        var correctbitmapclicked = false;
        if (tmpmouseX >= psy_stimuli1[psy_readkey.bitmap - 1].rect.x && tmpmouseX <= psy_stimuli1[psy_readkey.bitmap - 1].rect.x + psy_stimuli1[psy_readkey.bitmap - 1].rect.width && tmpmouseY >= psy_stimuli1[psy_readkey.bitmap - 1].rect.y && tmpmouseX <= psy_stimuli1[psy_readkey.bitmap - 1].rect.x + psy_stimuli1[psy_readkey.bitmap - 1].rect.height) {
            correctbitmapclicked = true
        }
        if (psy_readkey.expectedkey == e.button && correctbitmapclicked == true) keystatus.status = 1;
        else keystatus.status = 2;
        keystatus.mouse_x = tmpmouseX - psy_screen_x_offset;
        keystatus.mouse_y = tmpmouseY - psy_screen_y_offset;
        psy_readkey.expect_mouse = false;
        psy_readkey.stop()
    }
    if (psy_readkey.expect_mouse == true && psy_readkey.bitmap_range[0] > -1) {
        keystatus.time = (new Date).getTime() - psy_readkey.starttime;
        canvas_x_offset = c.getBoundingClientRect().left;
        canvas_y_offset = c.getBoundingClientRect().top;
        tmpmouseX = e.clientX - canvas_x_offset;
        tmpmouseY = e.clientY - canvas_y_offset;
        var tmpbitmap = psy_bitmap_under_mouse(0, psy_readkey.bitmap_range[0], psy_readkey.bitmap_range[1], tmpmouseX - psy_screen_x_offset, tmpmouseY - psy_screen_y_offset);
        if (tmpbitmap >= psy_readkey.bitmap_range[0] && tmpbitmap <= psy_readkey.bitmap_range[1]) {
            var correctbitmapclicked = false;
            if (tmpmouseX >= psy_stimuli1[psy_readkey.bitmap - 1].rect.x && tmpmouseX <= psy_stimuli1[psy_readkey.bitmap - 1].rect.x + psy_stimuli1[psy_readkey.bitmap - 1].rect.width && tmpmouseY >= psy_stimuli1[psy_readkey.bitmap - 1].rect.y && tmpmouseX <= psy_stimuli1[psy_readkey.bitmap - 1].rect.x + psy_stimuli1[psy_readkey.bitmap - 1].rect.height) {
                correctbitmapclicked = true
            }
            if (psy_readkey.expectedkey == e.button && correctbitmapclicked == true) keystatus.status = 1;
            else keystatus.status = 2;
            keystatus.mouse_x = tmpmouseX - psy_screen_x_offset;
            keystatus.mouse_y = tmpmouseY - psy_screen_y_offset;
            psy_readkey.expect_mouse = false;
            psy_readkey.bitmap_range = [-1, -1];
            psy_readkey.stop()
        }
    }
}

function psy_mouse_in_bitmap_rectangle(bitmap, maxwait) {
    psy_readkey.bitmap = bitmap;
    window.addEventListener("mousemove", getmouse_in_area, false);
    psy_readkey.mouseovereventlistener = true;
    psy_expect_mouse();
    psy_readkey.start(current_task, maxwait)
}

function psy_mouse_click_bitmap_rectangle(mousebutton, bitmap, maxwait) {
    psy_readkey.bitmap = bitmap;
    if (mousebutton == "l") {
        psy_readkey.expectedkey = 0
    } else {
        psy_readkey.expectedkey = 1
    }
    window.addEventListener("mousedown", getmouseclick_in_area, false);
    psy_readkey.mousedowneventlistener = true;
    psy_expect_mouse();
    psy_readkey.start(current_task, maxwait)
}

function psy_mouse_click_bitmap_rectangle_range(mousebutton, bitmap, maxwait, first, last) {
    psy_readkey.bitmap = bitmap;
    if (mousebutton == "l") {
        psy_readkey.expectedkey = 0
    } else {
        psy_readkey.expectedkey = 1
    }
    window.addEventListener("mousedown", getmouseclick_in_area, false);
    psy_readkey.mousedowneventlistener = true;
    psy_readkey.bitmap_range = [first, last];
    psy_expect_mouse();
    psy_readkey.start(current_task, maxwait)
}

function psy_bitmap_under_mouse(searchdirection, first, last, x, y) {
    var i = 0;
    var j = 0;
    var tmp = 0;
    var found_bitmap = -1;
    var allchecked = 1;
    i = 0;
    j = psy_stimuli1_n;
    if (first > -1) i = first - 1;
    if (last > -1) j = last - 1;
    if (searchdirection == 0 && i > j) {
        tmp = j;
        j = i;
        i = tmp
    }
    if (searchdirection == 1 && i < j) {
        tmp = j;
        j = i;
        i = tmp
    }
    while (allchecked == 1 && found_bitmap == -1) {
        if (x + psy_screen_x_offset >= psy_stimuli1[i].rect.x && x + psy_screen_x_offset <= psy_stimuli1[i].rect.x + psy_stimuli1[i].rect.width && y + psy_screen_y_offset >= psy_stimuli1[i].rect.y && y + psy_screen_y_offset <= psy_stimuli1[i].rect.y + psy_stimuli1[i].rect.height) {
            found_bitmap = i
        } else {}
        if (searchdirection == 0 && found_bitmap == -1) {
            if (i >= j) allchecked = 0;
            i++
        }
        if (searchdirection == 1 && found_bitmap == -1) {
            if (i <= j) allchecked = 0;
            i--
        }
    }
    return found_bitmap + 1
}

function psy_wait(stimulus, key) {
    if (stimulus != 0) {
        psy_clear_stimulus_counters_db();
        psy_add_centered_bitmap_db(stimulus, PSY_CENTRAL, PSY_CENTRAL);
        psy_draw_all_db()
    }
    psy_readkey.expectedkey = key;
    psy_readkey.keys = [key];
    psy_expect_keyboard();
    psy_readkey.start(current_block, 99999999)
}
var psy_pager = {
    original_block: "",
    current_bitmap_in_pager: 0,
    bitmaps: [],
    n: 0,
    start: function(bitmaps) {
        psy_pager.original_block = current_block;
        psy_pager.n = bitmaps.length;
        psy_pager.bitmaps = bitmaps;
        current_block = "psy_pager";
        psy_pager.current_bitmap_in_pager = 0;
        keystatus.key = -1;
        psy_pager.run()
    },
    run: function() {
        if ((keystatus.key == 32 || keystatus.key == 40) && psy_pager.current_bitmap_in_pager < psy_pager.n - 1) psy_pager.current_bitmap_in_pager++;
        if (keystatus.key == 38 && psy_pager.current_bitmap_in_pager > 0) psy_pager.current_bitmap_in_pager--;
        if (keystatus.key == 81) {
            current_block = psy_pager.original_block;
            psy_clear_screen_db();
            setTimeout(current_block + ".run()", 10)
        } else {
            psy_clear_stimulus_counters_db();
            psy_add_centered_bitmap_db(psy_pager.bitmaps[psy_pager.current_bitmap_in_pager], PSY_CENTRAL, PSY_CENTRAL);
            psy_draw_all_db();
            psy_readkey.expectedkey = 32;
            psy_readkey.keys = [32, 40, 38, 81];
            psy_expect_keyboard();
            psy_readkey.start(current_block, 99999999)
        }
    }
};

function psy_add_text_rgb_db(fontno, x, y, centerx, centery, r, g, b, text, align) {
    var xpos = 0,
        ypos = 0,
        width = 0,
        height = 0;
    psy_stimuli1[psy_stimuli1_end].x = x;
    psy_stimuli1[psy_stimuli1_end].y = y;
    psy_stimuli1[psy_stimuli1_end].type = 2;
    psy_stimuli1[psy_stimuli1_end].on = 1;
    ctx.font = psy_fonts[fontno];
    tmpsize = ctx.measureText(text);
    height = psy_fonts_size[fontno];
    width = tmpsize.width;
    tmpgraphicsCanvas = document.createElement("canvas");
    tmpgraphicsCanvas.width = width;
    tmpgraphicsCanvas.height = Math.round(height * 1.3);
    tmpgraphics = tmpgraphicsCanvas.getContext("2d");
    tmpgraphics.fillStyle = "#000000";
    tmpgraphics.fillRect(0, 0, width, height);
    tmpgraphics.fillStyle = hexrgb(r, g, b);
    tmpgraphics.font = psy_fonts[fontno];
    tmpgraphics.fillText(text, 0, height);
    psy_stimuli1[psy_stimuli1_end].text = tmpgraphicsCanvas;
    xpos = x;
    ypos = y;
    if (align == 0) {
        if (x == PSY_CENTRAL && centerx == PSY_CENTRAL) xpos = psy_screen_center_x - width / 2;
        if (x != PSY_CENTRAL && centerx == PSY_CENTRAL) xpos = x + psy_screen_x_offset - width / 2;
        if (y == PSY_CENTRAL && centery == PSY_CENTRAL) ypos = psy_screen_center_y - height / 2;
        if (y != PSY_CENTRAL && centery == PSY_CENTRAL) ypos = y + psy_screen_y_offset - height / 2
    }
    if (align == 1) {
        if (x == PSY_CENTRAL && centerx == PSY_CENTRAL) xpos = psy_screen_center_x;
        if (x != PSY_CENTRAL && centerx == PSY_CENTRAL) xpos = x + psy_screen_x_offset;
        if (y == PSY_CENTRAL && centery == PSY_CENTRAL) ypos = psy_screen_center_y - height / 2;
        if (y != PSY_CENTRAL && centery == PSY_CENTRAL) ypos = y + psy_screen_y_offset - height / 2
    }
    if (align == 2) {
        if (x == PSY_CENTRAL && centerx == PSY_CENTRAL) xpos = psy_screen_center_x - width;
        if (x != PSY_CENTRAL && centerx == PSY_CENTRAL) xpos = x + psy_screen_x_offset - width;
        if (y == PSY_CENTRAL && centery == PSY_CENTRAL) ypos = psy_screen_center_y - height / 2;
        if (y != PSY_CENTRAL && centery == PSY_CENTRAL) ypos = y + psy_screen_y_offset - height / 2
    }
    if (xpos < 0) xpos = 0;
    if (ypos < 0) ypos = 0;
    if (xpos > psy_screen_width) xpos = psy_screen_width - width;
    if (ypos > psy_screen_height) ypos = psy_screen_height - height;
    psy_stimuli1[psy_stimuli1_end].rect.x = xpos;
    psy_stimuli1[psy_stimuli1_end].rect.y = ypos;
    psy_stimuli1[psy_stimuli1_end].rect.width = width;
    psy_stimuli1[psy_stimuli1_end].rect.height = height;
    psy_stimuli1_n++;
    psy_stimuli1_end++;
    return psy_stimuli1_end
}

function psy_clear_screen_db() {
    psy_clear_stimulus_counters_db();
    psy_draw_all_db()
}

function psy_clear_stimuli1(number) {
    var tmp;
    if (number < 0) tmp = psy_stimuli1_end + number;
    else tmp = number - 1;
    if (psy_stimuli1[tmp].on != 0) {
        psy_stimuli1[tmp].on = 0;
        psy_stimuli1_n--
    }
}

function psy_unhide_stimuli1(number) {
    var tmp;
    if (number < 0) tmp = psy_stimuli1_end + number;
    else tmp = number - 1;
    if (psy_stimuli1[tmp].on != 1) {
        psy_stimuli1[tmp].on = 1;
        psy_stimuli1_n++
    }
}

function psy_clear_range_db(low, high) {
    var x = 0;
    var i = low;
    var j = high;
    if (low > high) {
        j = low;
        i = high
    }
    for (x = i; x <= j; x++) psy_clear_stimuli1(x)
}

function psy_unhide_range_db(low, high) {
    var x = 0;
    var i = low;
    var j = high;
    if (low > high) {
        j = low;
        i = high
    }
    for (x = i; x <= j; x++) psy_unhide_stimuli1(x)
}

function psy_clear_stimulus_counters_db() {
    var i = 0;
    while (i < psy_stimuli1_n) {
        psy_stimuli1[i].on = 0;
        i++
    }
    psy_stimuli1_n = psy_stimuli1_end = 0
}

function psy_random(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

function psy_random_weighted(chances, n) {
    var choosen = 0;
    var chance = 0;
    var max_chance = 0;
    var i;
    for (i = 0; i < n; i++) {
        if (chances[i] > 0) {
            chance = psy_random(chances[i] * 1e4, 1e4);
            if (chance > max_chance) {
                max_chance = chance;
                choosen = i
            }
        }
    }
    return choosen
}

function psy_random_by(low, high, by) {
    return Math.floor(Math.random() * (high + by - low) / by) * by + low
}

function psy_random_from_array(tmparray) {
    return tmparray[Math.round(Math.random() * (tmparray.length - 1))]
}

function psy_draw_all_db() {
    var i = 0;
    var activefound = 0;
    ctx.fillStyle = hexrgb(0, 0, 0);
    ctx.fillRect(0, 0, psy_screen_width, psy_screen_height);
    while (activefound < psy_stimuli1_n) {
        if (psy_stimuli1[i].on == 1) {
            activefound++;
            switch (psy_stimuli1[i].type) {
                case 0:
                    ctx.fillStyle = hexrgb(psy_stimuli1[i].r, psy_stimuli1[i].g, psy_stimuli1[i].b);
                    ctx.fillRect(psy_stimuli1[i].rect.x, psy_stimuli1[i].rect.y, psy_stimuli1[i].rect.width, psy_stimuli1[i].rect.height);
                    break;
                case 1:
                    ctx.drawImage(psy_bitmaps[psy_stimuli1[i].bitmap - 1], psy_stimuli1[i].rect.x, psy_stimuli1[i].rect.y);
                    break;
                case 2:
                    ctx.drawImage(psy_stimuli1[i].text, psy_stimuli1[i].rect.x, psy_stimuli1[i].rect.y);
                    break;
                case 3:
                    ctx.arc(psy_stimuli1[i].rect.x, psy_stimuli1[i].rect.y, psy_stimuli1[i].rect.width, 0, 2 * Math.PI, false);
                    ctx.fillStyle = hexrgb(psy_stimuli1[i].r, psy_stimuli1[i].g, psy_stimuli1[i].b);
                    ctx.fill();
                    break
            }
        }
        i++
    }
}

function psy_add_centered_rectangle_rgb_db(x, y, w, h, r, g, b) {
    var tmpx;
    var tmpy;
    psy_stimuli1[psy_stimuli1_end].x = x;
    psy_stimuli1[psy_stimuli1_end].y = y;
    psy_stimuli1[psy_stimuli1_end].type = 0;
    psy_stimuli1[psy_stimuli1_end].on = 1;
    if (x == PSY_CENTRAL) tmpx = psy_screen_center_x - w / 2;
    else tmpx = x + psy_screen_x_offset - w / 2;
    if (y == PSY_CENTRAL) tmpy = psy_screen_center_y - h / 2;
    else tmpy = y + psy_screen_y_offset - h / 2;
    psy_stimuli1[psy_stimuli1_end].rect.x = tmpx;
    psy_stimuli1[psy_stimuli1_end].rect.y = tmpy;
    psy_stimuli1[psy_stimuli1_end].rect.width = w;
    psy_stimuli1[psy_stimuli1_end].rect.height = h;
    psy_stimuli1[psy_stimuli1_end].r = r;
    psy_stimuli1[psy_stimuli1_end].g = g;
    psy_stimuli1[psy_stimuli1_end].b = b;
    psy_stimuli1_n++;
    psy_stimuli1_end++;
    return psy_stimuli1_end
}

function psy_add_centered_circle_rgb_db(x, y, radius, r, g, b) {
    var tmpx;
    var tmpy;
    psy_stimuli1[psy_stimuli1_end].x = x;
    psy_stimuli1[psy_stimuli1_end].y = y;
    psy_stimuli1[psy_stimuli1_end].type = 3;
    psy_stimuli1[psy_stimuli1_end].on = 1;
    if (x == PSY_CENTRAL) tmpx = psy_screen_center_x;
    else tmpx = x + psy_screen_x_offset;
    if (y == PSY_CENTRAL) tmpy = psy_screen_center_y;
    else tmpy = y + psy_screen_y_offset;
    psy_stimuli1[psy_stimuli1_end].rect.x = tmpx;
    psy_stimuli1[psy_stimuli1_end].rect.y = tmpy;
    psy_stimuli1[psy_stimuli1_end].rect.width = radius;
    psy_stimuli1[psy_stimuli1_end].r = r;
    psy_stimuli1[psy_stimuli1_end].g = g;
    psy_stimuli1[psy_stimuli1_end].b = b;
    psy_stimuli1_n++;
    psy_stimuli1_end++;
    return psy_stimuli1_end
}

function psy_add_centered_bitmap_db(number, x, y) {
    var tmpx;
    var tmpy;
    psy_stimuli1[psy_stimuli1_end].x = x;
    psy_stimuli1[psy_stimuli1_end].y = y;
    psy_stimuli1[psy_stimuli1_end].type = 1;
    psy_stimuli1[psy_stimuli1_end].on = 1;
    psy_stimuli1[psy_stimuli1_end].bitmap = number;
    if (x == PSY_CENTRAL) tmpx = psy_screen_center_x - psy_bitmaps[number - 1].width / 2;
    else tmpx = x + psy_screen_x_offset - psy_bitmaps[number - 1].width / 2;
    if (y == PSY_CENTRAL) tmpy = psy_screen_center_y - psy_bitmaps[number - 1].height / 2;
    else tmpy = y + psy_screen_y_offset - psy_bitmaps[number - 1].height / 2;
    psy_stimuli1[psy_stimuli1_end].rect.x = tmpx;
    psy_stimuli1[psy_stimuli1_end].rect.y = tmpy;
    psy_stimuli1[psy_stimuli1_end].rect.width = psy_bitmaps[number - 1].width;
    psy_stimuli1[psy_stimuli1_end].rect.height = psy_bitmaps[number - 1].height;
    psy_stimuli1_n++;
    psy_stimuli1_end++;
    return psy_stimuli1_end
}

function psy_set_coordinate_system(s) {
    if (s == "c") {
        psy_screen_x_offset = psy_screen_center_x;
        psy_screen_y_offset = psy_screen_center_y
    }
}

function Rectangle() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0
}

function psy_stimulus1() {
    this.on = 0;
    this.type = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.bitmap = 0;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.rect = 0
}
var psy_stimuli1 = new Array;
for (i = 0; i < 100; i++) {
    psy_stimuli1[i] = new psy_stimulus1;
    psy_stimuli1[i].rect = new Rectangle
}
var psy_stimuli1_n = 0;
var psy_stimuli1_end = 0;

function psy_mouse_visibility(visible) {
    if (visible == 1) {
        c.style.cursor = "default"
    } else {
        c.style.cursor = "none"
    }
}
var trial_counter;
var i;
var trials_left_to_do = 0;
var tasklist_end_request = 0;
var experiment_end_request = 0;
var Timer_tasklist_begin;
var Timer_tasklist_now;
var maxtasklisttime = 0;
var TRIAL_SELECTION_RANDOM = 0;
var TRIAL_SELECTION_RANDOM_NEVER_REPEAT = 1;
var TRIAL_SELECTION_FIXED_SEQUENCE = 2;
var TRIAL_SELECTION_REPEAT_ON_ERROR = 3;
var TRIAL_SELECTION_ONCE = 4;
var error_status;
trial_counter_per_task = new Array;
task_probability = new Array;
var blockname = "";
var blockrepeat = 1;
var current_trial = new Array;
var current_task = "";
var current_block = "";

function psy_time_since_start() {
    return (new Date).getTime() - psy_exp_start_time
}

function psy_diff_timers(starttime, endtime) {
    return endtime - starttime
}

function psy_delay(ms) {
    setTimeout(current_task + ".run();", ms)
}

function psy_delay_block(ms) {
    setTimeout(current_block + ".run();", ms)
}
var psy_chosen_n = 0;
var psy_chosen_objects = [];
var choose = {
    first: 0,
    last: 0,
    counter1: 0,
    counter2: 0,
    mouse_select_bitmap: 0,
    mouse_select_bg_bitmap: 0,
    keep: false,
    minselect: 0,
    maxselect: 9999,
    current_exit_bitmap_num: 0,
    n_selected: 0,
    exit: -1,
    exit_bitmap_1: -1,
    exit_bitmap_2: -1,
    selectedstimuli: [],
    expect_key: 0,
    timer: 0,
    getmouseclick: function(e) {
        if (choose.expect_key == 1) {
            canvas_x_offset = c.getBoundingClientRect().left;
            canvas_y_offset = c.getBoundingClientRect().top;
            tmpmouseX = e.clientX - canvas_x_offset - psy_screen_x_offset;
            tmpmouseY = e.clientY - canvas_y_offset - psy_screen_y_offset;
            tmpnum = psy_bitmap_under_mouse(0, choose.current_exit_bitmap_num, choose.current_exit_bitmap_num, tmpmouseX, tmpmouseY);
            if (tmpnum == choose.current_exit_bitmap_num && choose.n_selected >= choose.minselect && choose.n_selected <= choose.maxselect) {
                choose.stop()
            } else {
                tmpnum = psy_bitmap_under_mouse(0, choose.first, choose.last, tmpmouseX, tmpmouseY);
                tmpx = psy_stimuli1[tmpnum - 1].x;
                tmpy = psy_stimuli1[tmpnum - 1].y;
                if (choose.selectedstimuli[tmpnum] == null) {
                    if (choose.n_selected < choose.maxselect) {
                        choose.selectedstimuli[tmpnum] = psy_add_centered_bitmap_db(choose.mouse_select_bitmap, tmpx, tmpy);
                        choose.n_selected++
                    }
                } else {
                    psy_clear_stimuli1(choose.selectedstimuli[tmpnum]);
                    choose.selectedstimuli[tmpnum] = null;
                    choose.n_selected--
                }
                if (choose.n_selected >= choose.minselect && choose.n_selected <= choose.maxselect) {
                    if (choose.current_exit_bitmap_num == choose.exit_bitmap_2) {
                        psy_unhide_stimuli1(choose.exit_bitmap_1);
                        psy_clear_stimuli1(choose.exit_bitmap_2);
                        choose.current_exit_bitmap_num = choose.exit_bitmap_1
                    }
                } else {
                    if (choose.current_exit_bitmap_num == choose.exit_bitmap_1) {
                        psy_unhide_stimuli1(choose.exit_bitmap_2);
                        psy_clear_stimuli1(choose.exit_bitmap_1);
                        choose.current_exit_bitmap_num = choose.exit_bitmap_2
                    }
                }
                psy_draw_all_db()
            }
        }
    },
    timeout: function() {
        window.removeEventListener("mousedown", choose.getmouseclick, false);
        psy_clear_stimuli1(choose.exit_bitmap_1);
        psy_clear_stimuli1(choose.exit_bitmap_2);
        if (!choose.keep) {
            for (i = choose.first; i < choose.last; i++) {
                if (choose.selectedstimuli[i] != null) {
                    psy_clear_stimuli1(choose.selectedstimuli[i])
                }
            }
            psy_stimuli1_n = choose.counter1;
            psy_stimuli1_end = choose.counter2
        }
        psy_draw_all_db();
        choose.expect_key = 0;
        choose.maxselect = 9999;
        setTimeout(current_task + ".run()", 0)
    },
    stop: function() {
        keystatus.time = (new Date).getTime() - choose.starttime;
        psy_chosen_n = 0;
        psy_chosen_objects = Array(100).fill(0);
        for (i = choose.first; i <= choose.last; i++) {
            if (choose.selectedstimuli[i] != null) {
                psy_chosen_objects[psy_chosen_n] = i;
                psy_chosen_n++
            }
        }
        clearTimeout(choose.timer);
        choose.timeout()
    }
};

function psy_choose(maxtime, stimulus_first, stimulus_last, exit1, exit2, exit_x, exit_y) {
    choose.counter1 = psy_stimuli1_n;
    choose.counter2 = psy_stimuli1_end;
    choose.exit_bitmap_1 = psy_add_centered_bitmap_db(exit1, exit_x, exit_y);
    choose.exit_bitmap_2 = psy_add_centered_bitmap_db(exit2, exit_x, exit_y);
    psy_clear_stimuli1(choose.exit_bitmap_1);
    psy_clear_stimuli1(choose.exit_bitmap_2);
    choose.expect_key = 1;
    choose.n_selected = 0;
    choose.first = stimulus_first;
    choose.last = stimulus_last;
    choose.selectedstimuli = [];
    if (choose.n_selected >= choose.minselect && choose.n_selected <= choose.maxselect) {
        psy_unhide_stimuli1(choose.exit_bitmap_1);
        choose.current_exit_bitmap_num = choose.exit_bitmap_1
    } else {
        psy_unhide_stimuli1(choose.exit_bitmap_2);
        choose.current_exit_bitmap_num = choose.exit_bitmap_2
    }
    psy_draw_all_db();
    window.addEventListener("mousedown", choose.getmouseclick, false);
    choose.timer = setTimeout("choose.timeout()", maxtime);
    choose.starttime = (new Date).getTime()
}

function psy_scale_point_x(x, realx, realw, xlim1, xlim2) {
    xlimrange = xlim2 - xlim1;
    rangefactor = realw / xlimrange;
    return realx + (x - xlim1) * rangefactor
}

function psy_scale_point_y(y, realy, realh, ylim1, ylim2) {
    ylimrange = ylim2 - ylim1;
    rangefactor = realh / ylimrange;
    return realy + realh - (y - ylim1) * rangefactor
}

function psy_palette(colornumber) {
    switch (colornumber) {
        case 1:
            color = "white";
            break;
        case 2:
            color = "red";
            break;
        case 3:
            color = "green";
            break;
        case 4:
            color = "yellow";
            break;
        case 5:
            color = "blue";
            break
    }
    return color
}

function psy_plot_xaxis(x, y, w, xlim1, xlim2) {
    var i;
    for (i = xlim1; i < xlim2; i++) {
        if (i % 100 == 0) {
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText(i, psy_scale_point_x(i, x, w, xlim1, xlim2) - 10, y + 20);
            ctx.beginPath();
            ctx.moveTo(psy_scale_point_x(i, x, w, xlim1, xlim2), y);
            ctx.lineTo(psy_scale_point_x(i, x, w, xlim1, xlim2), y + 8);
            ctx.stroke()
        } else {
            if (i % 10 == 0) {
                ctx.beginPath();
                ctx.moveTo(psy_scale_point_x(i, x, w, xlim1, xlim2), y);
                ctx.lineTo(psy_scale_point_x(i, x, w, xlim1, xlim2), y + 4);
                ctx.stroke()
            }
        }
    }
}

function psy_plot_yaxis(x, y, w, ylim1, ylim2) {
    var i;
    for (i = ylim1; i < ylim2; i++) {
        if (i % 50 == 0) {
            ctx.fillStyle = "white";
            ctx.font = "12px Arial";
            ctx.fillText(i, x - 30, psy_scale_point_y(i, y, w, ylim1, ylim2) + 3);
            ctx.beginPath();
            ctx.moveTo(x - 8, psy_scale_point_y(i, y, w, ylim1, ylim2));
            ctx.lineTo(x, psy_scale_point_y(i, y, w, ylim1, ylim2));
            ctx.stroke()
        } else {
            if (i % 10 == 0) {
                ctx.beginPath();
                ctx.moveTo(x - 4, psy_scale_point_y(i, y, w, ylim1, ylim2));
                ctx.lineTo(x, psy_scale_point_y(i, y, w, ylim1, ylim2));
                ctx.stroke()
            }
        }
    }
}

function psy_plot_circle(x, y, radius, colorname) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = colorname;
    ctx.fill()
}

function numsort(a, b) {
    return a - b
}

function minimum(a) {
    tmp = a.slice();
    return tmp.sort(numsort)[0]
}

function maximum(a) {
    tmp = a.slice();
    return tmp.sort(numsort)[tmp.length - 1]
}

function psy_xyplot(x, y, w, h, box, col, xdata, ydata, xlabel, ylabel) {
    xlim1 = minimum(xdata) - 10;
    xlim2 = maximum(xdata) + 10;
    ylim1 = minimum(ydata) - 10;
    ylim2 = maximum(ydata) + 10;
    for (i = 0; i < xdata.length; i++) {
        psy_plot_circle(psy_scale_point_x(xdata[i], x, w, xlim1, xlim2), psy_scale_point_y(ydata[i], y, h, ylim1, ylim2), 4, psy_palette(col))
    }
    ctx.beginPath();
    ctx.strokeStyle = psy_palette(col);
    ctx.rect(x, y, w, h);
    ctx.stroke();
    psy_plot_xaxis(x, y + h, w, xlim1, xlim2);
    psy_plot_yaxis(x, y, h, ylim1, ylim2);
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(xlabel, x + w / 2, y + h + 30);
    ctx.save();
    ctx.translate(x - 50, y + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(ylabel, 0, 0);
    ctx.restore()
}

function psy_lineplot(x, y, w, h, box, ydata, colors, xlabel, ylabel) {
    xlim1 = 1 - 5;
    xlim2 = ydata.length + 5;
    ylim1 = minimum(ydata) - 10;
    ylim2 = maximum(ydata) + 10;
    previousx = 0;
    previousy = 0;
    for (i = 0; i < ydata.length; i++) {
        tmpx = psy_scale_point_x(i, x, w, xlim1, xlim2);
        tmpy = psy_scale_point_y(ydata[i], y, h, ylim1, ylim2);
        psy_plot_circle(tmpx, tmpy, 4, psy_palette(colors[i]));
        if (i > 0) {
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(previousx, previousy);
            ctx.lineTo(tmpx, tmpy);
            ctx.stroke()
        }
        previousx = tmpx;
        previousy = tmpy
    }
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(x, y, w, h);
    ctx.stroke();
    psy_plot_xaxis(x, y + h, w, xlim1, xlim2);
    psy_plot_yaxis(x, y, h, ylim1, ylim2);
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(xlabel, x + w / 2, y + h + 30);
    ctx.save();
    ctx.translate(x - 50, y + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(ylabel, 0, 0);
    ctx.restore()
}

function psy_fullscreen(o) {
    if (o.requestFullScreen) o.requestFullScreen();
    else if (o.webkitRequestFullScreen) o.webkitRequestFullScreen(c.ALLOW_KEYBOARD_INPUT);
    else if (o.mozRequestFullScreen) o.mozRequestFullScreen();
    else if (o.msRequestFullscreen) o.msRequestFullscreen()
}

function psy_exit_fullscreen() {
    if (document.exitFullScreen) document.exitFullScreen();
    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen()
}

function formatoutputdata(text) {
    tmp = text.split(/\r?\n/);
    out = "";
    for (i = 0; i < tmp.length - 1; i++) {
        tmp2 = tmp[i].split(/\s+/);
        out = out + "<tr>";
        for (j = 0; j < tmp2.length; j++) {
            out = out + "<td>" + tmp2[j] + "</td>"
        }
        out = out + "</tr>"
    }
    return out
}

function showdata_html() {
    var newbutton = document.createElement("BUTTON");
    var newtext = document.createTextNode("Show data");
    console.log(outputdata)
    var url = "https://waterloo-iat.appspot.com/add_result";
    var method = "POST";

    var shouldBeAsync = false;

    var request = new XMLHttpRequest();
    request.onload = function () {
       var status = request.status;
       var data = request.responseText;
    }
    request.open(method, url, shouldBeAsync);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(outputdata);
    alert('Thanks for participating!');

    newbutton.appendChild(newtext);
    newbutton.setAttribute("onclick", 'showdata.innerHTML = "<table border=1>" + formatoutputdata(outputdata) + "</table>";');
    document.body.appendChild(newbutton)
}

var instructions = 1;
var smiley = 2;
var frowny = 3;
var ready = 4;
var arial = 0;
var order = 0;
var meanrt = 0;
var meanrt_com = 0;
var meanrt_inc = 0;
var iat_effect = 0;
var general_trial_counter = 0;
var selectedoncecount_table_biotech_electrical_tech_list = 0;

function biotech_electrical_tech_listtype(x1, x2, x3, xselected) {
    this.c1 = x1;
    this.c2 = x2;
    this.c3 = x3;
    this.selected = xselected
}
var biotech_electrical_tech_list = [new biotech_electrical_tech_listtype("GMO", 1, 2, 0), new biotech_electrical_tech_listtype("enzyme", 1, 2, 0), new biotech_electrical_tech_listtype("bacteria", 1, 2, 0), new biotech_electrical_tech_listtype("DNA", 1, 2, 0), new biotech_electrical_tech_listtype("optogenetics", 1, 2, 0), new biotech_electrical_tech_listtype("in vitro", 1, 2, 0), new biotech_electrical_tech_listtype("bacteriophage", 1, 2, 0), new biotech_electrical_tech_listtype("genome", 1, 2, 0), new biotech_electrical_tech_listtype("bioreactor", 1, 2, 0), new biotech_electrical_tech_listtype("mutagenesis", 1, 2, 0), new biotech_electrical_tech_listtype("computer", 2, 1, 0), new biotech_electrical_tech_listtype("tablet", 2, 1, 0), new biotech_electrical_tech_listtype("smartphone", 2, 1, 0), new biotech_electrical_tech_listtype("satellite", 2, 1, 0), new biotech_electrical_tech_listtype("internet", 2, 1, 0), new biotech_electrical_tech_listtype("television", 2, 1, 0), new biotech_electrical_tech_listtype("solar panels", 2, 1, 0), new biotech_electrical_tech_listtype("virtual reality", 2, 1, 0), new biotech_electrical_tech_listtype("laptop", 2, 1, 0), new biotech_electrical_tech_listtype("camera", 2, 1, 0)];
var selectedoncecount_table_pleasant_unpleasant_list = 0;

function pleasant_unpleasant_listtype(x1, x2, x3, xselected) {
    this.c1 = x1;
    this.c2 = x2;
    this.c3 = x3;
    this.selected = xselected
}
var pleasant_unpleasant_list = [new pleasant_unpleasant_listtype("compassion", 1, 1, 0), new pleasant_unpleasant_listtype("comfort", 1, 1, 0), new pleasant_unpleasant_listtype("fun", 1, 1, 0), new pleasant_unpleasant_listtype("smile", 1, 1, 0), new pleasant_unpleasant_listtype("gentle", 1, 1, 0), new pleasant_unpleasant_listtype("exciting", 1, 1, 0), new pleasant_unpleasant_listtype("friend", 1, 1, 0), new pleasant_unpleasant_listtype("happy", 1, 1, 0), new pleasant_unpleasant_listtype("laughter", 1, 1, 0), new pleasant_unpleasant_listtype("joyful", 1, 1, 0), new pleasant_unpleasant_listtype("frown", 2, 1, 0), new pleasant_unpleasant_listtype("sad", 2, 1, 0), new pleasant_unpleasant_listtype("illness", 2, 1, 0), new pleasant_unpleasant_listtype("pollution", 2, 1, 0), new pleasant_unpleasant_listtype("grief", 2, 1, 0), new pleasant_unpleasant_listtype("toxic", 2, 1, 0), new pleasant_unpleasant_listtype("scary", 2, 1, 0), new pleasant_unpleasant_listtype("injury", 2, 1, 0), new pleasant_unpleasant_listtype("mean", 2, 1, 0), new pleasant_unpleasant_listtype("upset", 2, 1, 0)];
var selectedoncecount_table_biotech_electrical_tech_pleasant_unpleasant_list = 0;

function biotech_electrical_tech_pleasant_unpleasant_listtype(x1, x2, x3, xselected) {
    this.c1 = x1;
    this.c2 = x2;
    this.c3 = x3;
    this.selected = xselected
}
var biotech_electrical_tech_pleasant_unpleasant_list = [new biotech_electrical_tech_pleasant_unpleasant_listtype("GMO", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("enzyme", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("bacteria", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("DNA", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("optogenetics", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("in vitro", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("bacteriophage", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("genome", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("bioreactor", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("mutagenesis", 1, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("computer", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("tablet", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("smartphone", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("satellite", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("internet", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("television", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("solar panels", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("virtual reality", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("laptop", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("camera", 2, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("compassion", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("comfort", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("fun", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("smile", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("gentle", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("exciting", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("friend", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("happy", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("laughter", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("joyful", 1, 1, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("frown", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("sad", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("illness", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("pollution", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("grief", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("toxic", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("scary", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("injury", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("mean", 2, 2, 0), new biotech_electrical_tech_pleasant_unpleasant_listtype("upset", 2, 2, 0)];
var task_biotech_electrical_tech = {
    step: 1,
    task_trial_selection: 0,
    current_trial: -1,
    taskname: "task_biotech_electrical_tech",
    tasknumber: 1,
    start: function(trial_selection) {
        task_biotech_electrical_tech.trial_selection = trial_selection;
        task_biotech_electrical_tech.step = 1;
        psy_clear_stimulus_counters_db();
        task_biotech_electrical_tech.run()
    },
    run: function() {
        current_task = task_biotech_electrical_tech.taskname;
        switch (task_biotech_electrical_tech.step) {
            case 1:
                task_biotech_electrical_tech.step++;
                general_trial_counter++;
                possiblekeys = [69, 73];
                if (task_biotech_electrical_tech.trial_selection == TRIAL_SELECTION_RANDOM) {
                    tablerow = psy_random(0, 19);
                    task_biotech_electrical_tech.current_trial = tablerow
                }
                if (task_biotech_electrical_tech.trial_selection == TRIAL_SELECTION_RANDOM_NEVER_REPEAT) {
                    tablerow = psy_random(0, 19);
                    while (tablerow == task_biotech_electrical_tech.current_trial) tablerow = psy_random(0, 19);
                    task_biotech_electrical_tech.current_trial = tablerow
                }
                if (task_biotech_electrical_tech.trial_selection == TRIAL_SELECTION_FIXED_SEQUENCE) {
                    task_biotech_electrical_tech.current_trial++;
                    if (task_biotech_electrical_tech.current_trial == 20) task_biotech_electrical_tech.current_trial = 0;
                    tablerow = task_biotech_electrical_tech.current_trial
                }
                if (task_biotech_electrical_tech.trial_selection == TRIAL_SELECTION_REPEAT_ON_ERROR) {
                    if (error_status != 0 && task_biotech_electrical_tech.current_trial != -1) {
                        tablerow = task_biotech_electrical_tech.current_trial
                    } else {
                        tablerow = psy_random(0, 19);
                        task_biotech_electrical_tech.current_trial = tablerow
                    }
                }
                if (task_biotech_electrical_tech.trial_selection == TRIAL_SELECTION_ONCE) {
                    if (selectedoncecount_table_biotech_electrical_tech_list == 20) {
                        for (tmptr = 0; tmptr < 20; tmptr++) biotech_electrical_tech_list[tmptr].selected = 0;
                        selectedoncecount_table_biotech_electrical_tech_list = 0
                    }
                    tablerow = psy_random(0, 19);
                    while (biotech_electrical_tech_list[tablerow].selected == 1) tablerow = psy_random(0, 19);
                    task_biotech_electrical_tech.current_trial = tablerow;
                    selectedoncecount_table_biotech_electrical_tech_list++;
                    biotech_electrical_tech_list[tablerow].selected = 1
                }
                error_status = 0;
                if (!(order == 1)) {
                    task_biotech_electrical_tech.step = 3
                };
                setTimeout("task_biotech_electrical_tech.run()", 0);
                break;
            case 2:
                task_biotech_electrical_tech.step++;
                psy_add_text_rgb_db(0, -250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "biotech", 0);
                psy_add_text_rgb_db(0, 250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "electrical_tech", 0);
                task_biotech_electrical_tech.run();
                break;
            case 3:
                task_biotech_electrical_tech.step++;
                if (!(order == 2)) {
                    task_biotech_electrical_tech.step = 5
                };
                setTimeout("task_biotech_electrical_tech.run()", 0);
                break;
            case 4:
                task_biotech_electrical_tech.step++;
                psy_add_text_rgb_db(0, -250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "electrical_tech", 0);
                psy_add_text_rgb_db(0, 250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "biotech", 0);
                task_biotech_electrical_tech.run();
                break;
            case 5:
                task_biotech_electrical_tech.step++;
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 6:
                task_biotech_electrical_tech.step++;
                psy_add_centered_rectangle_rgb_db(0, 0, 10, 10, 255, 255, 255);
                psy_draw_all_db();
                psy_delay(200);
                break;
            case 7:
                task_biotech_electrical_tech.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(200);
                break;
            case 8:
                task_biotech_electrical_tech.step++;
                psy_add_text_rgb_db(0, PSY_CENTRAL, PSY_CENTRAL, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, biotech_electrical_tech_list[tablerow].c1, 0);
                psy_draw_all_db();
                if (!(order == 1)) {
                    task_biotech_electrical_tech.step = 11
                };
                setTimeout("task_biotech_electrical_tech.run()", 0);
                break;
            case 9:
                task_biotech_electrical_tech.step++;
                psy_keyboard(possiblekeys, 2, biotech_electrical_tech_list[tablerow].c2 - 1, 3e3);
                break;
            case 10:
                task_biotech_electrical_tech.step++;
                task_biotech_electrical_tech.run();
                break;
            case 11:
                task_biotech_electrical_tech.step++;
                if (!(order == 2)) {
                    task_biotech_electrical_tech.step = 14
                };
                setTimeout("task_biotech_electrical_tech.run()", 0);
                break;
            case 12:
                task_biotech_electrical_tech.step++;
                psy_keyboard(possiblekeys, 2, biotech_electrical_tech_list[tablerow].c3 - 1, 3e3);
                break;
            case 13:
                task_biotech_electrical_tech.step++;
                task_biotech_electrical_tech.run();
                break;
            case 14:
                task_biotech_electrical_tech.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                if (!(keystatus.status != 1)) {
                    task_biotech_electrical_tech.step = 22
                };
                setTimeout("task_biotech_electrical_tech.run()", 0);
                break;
            case 15:
                task_biotech_electrical_tech.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 16:
                task_biotech_electrical_tech.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 17:
                task_biotech_electrical_tech.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 18:
                task_biotech_electrical_tech.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 19:
                task_biotech_electrical_tech.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 20:
                task_biotech_electrical_tech.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 21:
                task_biotech_electrical_tech.step++;
                task_biotech_electrical_tech.run();
                break;
            case 22:
                task_biotech_electrical_tech.step++;
                if (!(keystatus.status == 1)) {
                    task_biotech_electrical_tech.step = 26
                };
                setTimeout("task_biotech_electrical_tech.run()", 0);
                break;
            case 23:
                task_biotech_electrical_tech.step++;
                psy_add_centered_bitmap_db(smiley, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 24:
                task_biotech_electrical_tech.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 25:
                task_biotech_electrical_tech.step++;
                task_biotech_electrical_tech.run();
                break;
            case 26:
                task_biotech_electrical_tech.step++;
                psy_delay(700);
                break;
            case 27:
                task_biotech_electrical_tech.step++;
                addoutput(current_block.substring(6, current_block.length) + " " + setTimeout("blocks" + psy_blockorder + ".blocknumber", 0) + " " + biotech_electrical_tech_list[tablerow].c1 + " " + keystatus.time + " " + keystatus.status);
                setTimeout(current_block + ".run()", 0);
                break
        }
    }
};
var task_pleasant_unpleasant = {
    step: 1,
    task_trial_selection: 0,
    current_trial: -1,
    taskname: "task_pleasant_unpleasant",
    tasknumber: 2,
    start: function(trial_selection) {
        task_pleasant_unpleasant.trial_selection = trial_selection;
        task_pleasant_unpleasant.step = 1;
        psy_clear_stimulus_counters_db();
        task_pleasant_unpleasant.run()
    },
    run: function() {
        current_task = task_pleasant_unpleasant.taskname;
        switch (task_pleasant_unpleasant.step) {
            case 1:
                task_pleasant_unpleasant.step++;
                general_trial_counter++;
                possiblekeys = [69, 73];
                if (task_pleasant_unpleasant.trial_selection == TRIAL_SELECTION_RANDOM) {
                    tablerow = psy_random(0, 19);
                    task_pleasant_unpleasant.current_trial = tablerow
                }
                if (task_pleasant_unpleasant.trial_selection == TRIAL_SELECTION_RANDOM_NEVER_REPEAT) {
                    tablerow = psy_random(0, 19);
                    while (tablerow == task_pleasant_unpleasant.current_trial) tablerow = psy_random(0, 19);
                    task_pleasant_unpleasant.current_trial = tablerow
                }
                if (task_pleasant_unpleasant.trial_selection == TRIAL_SELECTION_FIXED_SEQUENCE) {
                    task_pleasant_unpleasant.current_trial++;
                    if (task_pleasant_unpleasant.current_trial == 20) task_pleasant_unpleasant.current_trial = 0;
                    tablerow = task_pleasant_unpleasant.current_trial
                }
                if (task_pleasant_unpleasant.trial_selection == TRIAL_SELECTION_REPEAT_ON_ERROR) {
                    if (error_status != 0 && task_pleasant_unpleasant.current_trial != -1) {
                        tablerow = task_pleasant_unpleasant.current_trial
                    } else {
                        tablerow = psy_random(0, 19);
                        task_pleasant_unpleasant.current_trial = tablerow
                    }
                }
                if (task_pleasant_unpleasant.trial_selection == TRIAL_SELECTION_ONCE) {
                    if (selectedoncecount_table_pleasant_unpleasant_list == 20) {
                        for (tmptr = 0; tmptr < 20; tmptr++) pleasant_unpleasant_list[tmptr].selected = 0;
                        selectedoncecount_table_pleasant_unpleasant_list = 0
                    }
                    tablerow = psy_random(0, 19);
                    while (pleasant_unpleasant_list[tablerow].selected == 1) tablerow = psy_random(0, 19);
                    task_pleasant_unpleasant.current_trial = tablerow;
                    selectedoncecount_table_pleasant_unpleasant_list++;
                    pleasant_unpleasant_list[tablerow].selected = 1
                }
                error_status = 0;
                psy_add_text_rgb_db(0, -250, 50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "pleasant", 0);
                psy_add_text_rgb_db(0, 250, 50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "unpleasant", 0);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 2:
                task_pleasant_unpleasant.step++;
                psy_add_centered_rectangle_rgb_db(0, 0, 10, 10, 255, 255, 255);
                psy_draw_all_db();
                psy_delay(200);
                break;
            case 3:
                task_pleasant_unpleasant.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(200);
                break;
            case 4:
                task_pleasant_unpleasant.step++;
                psy_add_text_rgb_db(0, PSY_CENTRAL, PSY_CENTRAL, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, pleasant_unpleasant_list[tablerow].c1, 0);
                psy_draw_all_db();
                psy_keyboard(possiblekeys, 2, pleasant_unpleasant_list[tablerow].c2 - 1, 3e3);
                break;
            case 5:
                task_pleasant_unpleasant.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                if (!(keystatus.status != 1)) {
                    task_pleasant_unpleasant.step = 13
                };
                setTimeout("task_pleasant_unpleasant.run()", 0);
                break;
            case 6:
                task_pleasant_unpleasant.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 7:
                task_pleasant_unpleasant.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 8:
                task_pleasant_unpleasant.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 9:
                task_pleasant_unpleasant.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 10:
                task_pleasant_unpleasant.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 11:
                task_pleasant_unpleasant.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 12:
                task_pleasant_unpleasant.step++;
                task_pleasant_unpleasant.run();
                break;
            case 13:
                task_pleasant_unpleasant.step++;
                if (!(keystatus.status == 1)) {
                    task_pleasant_unpleasant.step = 17
                };
                setTimeout("task_pleasant_unpleasant.run()", 0);
                break;
            case 14:
                task_pleasant_unpleasant.step++;
                psy_add_centered_bitmap_db(smiley, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 15:
                task_pleasant_unpleasant.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 16:
                task_pleasant_unpleasant.step++;
                task_pleasant_unpleasant.run();
                break;
            case 17:
                task_pleasant_unpleasant.step++;
                psy_delay(700);
                break;
            case 18:
                task_pleasant_unpleasant.step++;
                addoutput(current_block.substring(6, current_block.length) + " " + setTimeout("blocks" + psy_blockorder + ".blocknumber", 0) + " " + pleasant_unpleasant_list[tablerow].c1 + " " + keystatus.time + " " + keystatus.status);
                setTimeout(current_block + ".run()", 0);
                break
        }
    }
};
var task_mixed = {
    step: 1,
    task_trial_selection: 0,
    current_trial: -1,
    taskname: "task_mixed",
    tasknumber: 3,
    start: function(trial_selection) {
        task_mixed.trial_selection = trial_selection;
        task_mixed.step = 1;
        psy_clear_stimulus_counters_db();
        task_mixed.run()
    },
    run: function() {
        current_task = task_mixed.taskname;
        switch (task_mixed.step) {
            case 1:
                task_mixed.step++;
                general_trial_counter++;
                possiblekeys = [69, 73];
                if (task_mixed.trial_selection == TRIAL_SELECTION_RANDOM) {
                    tablerow = psy_random(0, 39);
                    task_mixed.current_trial = tablerow
                }
                if (task_mixed.trial_selection == TRIAL_SELECTION_RANDOM_NEVER_REPEAT) {
                    tablerow = psy_random(0, 39);
                    while (tablerow == task_mixed.current_trial) tablerow = psy_random(0, 39);
                    task_mixed.current_trial = tablerow
                }
                if (task_mixed.trial_selection == TRIAL_SELECTION_FIXED_SEQUENCE) {
                    task_mixed.current_trial++;
                    if (task_mixed.current_trial == 40) task_mixed.current_trial = 0;
                    tablerow = task_mixed.current_trial
                }
                if (task_mixed.trial_selection == TRIAL_SELECTION_REPEAT_ON_ERROR) {
                    if (error_status != 0 && task_mixed.current_trial != -1) {
                        tablerow = task_mixed.current_trial
                    } else {
                        tablerow = psy_random(0, 39);
                        task_mixed.current_trial = tablerow
                    }
                }
                if (task_mixed.trial_selection == TRIAL_SELECTION_ONCE) {
                    if (selectedoncecount_table_biotech_electrical_tech_pleasant_unpleasant_list == 40) {
                        for (tmptr = 0; tmptr < 40; tmptr++) biotech_electrical_tech_pleasant_unpleasant_list[tmptr].selected = 0;
                        selectedoncecount_table_biotech_electrical_tech_pleasant_unpleasant_list = 0
                    }
                    tablerow = psy_random(0, 39);
                    while (biotech_electrical_tech_pleasant_unpleasant_list[tablerow].selected == 1) tablerow = psy_random(0, 39);
                    task_mixed.current_trial = tablerow;
                    selectedoncecount_table_biotech_electrical_tech_pleasant_unpleasant_list++;
                    biotech_electrical_tech_pleasant_unpleasant_list[tablerow].selected = 1
                }
                error_status = 0;
                if (!(order == 1)) {
                    task_mixed.step = 3
                };
                setTimeout("task_mixed.run()", 0);
                break;
            case 2:
                task_mixed.step++;
                psy_add_text_rgb_db(0, -250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "biotech", 0);
                psy_add_text_rgb_db(0, 250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "electrical_tech", 0);
                task_mixed.run();
                break;
            case 3:
                task_mixed.step++;
                if (!(order == 2)) {
                    task_mixed.step = 5
                };
                setTimeout("task_mixed.run()", 0);
                break;
            case 4:
                task_mixed.step++;
                psy_add_text_rgb_db(0, -250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "electrical_tech", 0);
                psy_add_text_rgb_db(0, 250, -50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "biotech", 0);
                task_mixed.run();
                break;
            case 5:
                task_mixed.step++;
                psy_add_text_rgb_db(0, -250, 50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "pleasant", 0);
                psy_add_text_rgb_db(0, 250, 50, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "unpleasant", 0);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 6:
                task_mixed.step++;
                psy_add_centered_rectangle_rgb_db(0, 0, 10, 10, 255, 255, 255);
                psy_draw_all_db();
                psy_delay(200);
                break;
            case 7:
                task_mixed.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(200);
                break;
            case 8:
                task_mixed.step++;
                psy_add_text_rgb_db(0, PSY_CENTRAL, PSY_CENTRAL, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, biotech_electrical_tech_pleasant_unpleasant_list[tablerow].c1, 0);
                psy_draw_all_db();
                if (!(order == 1)) {
                    task_mixed.step = 11
                };
                setTimeout("task_mixed.run()", 0);
                break;
            case 9:
                task_mixed.step++;
                psy_keyboard(possiblekeys, 2, biotech_electrical_tech_pleasant_unpleasant_list[tablerow].c2 - 1, 3e3);
                break;
            case 10:
                task_mixed.step++;
                task_mixed.run();
                break;
            case 11:
                task_mixed.step++;
                if (!(order == 2)) {
                    task_mixed.step = 14
                };
                setTimeout("task_mixed.run()", 0);
                break;
            case 12:
                task_mixed.step++;
                psy_keyboard(possiblekeys, 2, biotech_electrical_tech_pleasant_unpleasant_list[tablerow].c3 - 1, 3e3);
                break;
            case 13:
                task_mixed.step++;
                task_mixed.run();
                break;
            case 14:
                task_mixed.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                if (!(keystatus.status != 1)) {
                    task_mixed.step = 22
                };
                setTimeout("task_mixed.run()", 0);
                break;
            case 15:
                task_mixed.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 16:
                task_mixed.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 17:
                task_mixed.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 18:
                task_mixed.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 19:
                task_mixed.step++;
                psy_add_centered_bitmap_db(frowny, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(100);
                break;
            case 20:
                task_mixed.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 21:
                task_mixed.step++;
                task_mixed.run();
                break;
            case 22:
                task_mixed.step++;
                if (!(keystatus.status == 1)) {
                    task_mixed.step = 26
                };
                setTimeout("task_mixed.run()", 0);
                break;
            case 23:
                task_mixed.step++;
                psy_add_centered_bitmap_db(smiley, PSY_CENTRAL, PSY_CENTRAL);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 24:
                task_mixed.step++;
                psy_clear_stimuli1(-1);
                psy_draw_all_db();
                psy_delay(300);
                break;
            case 25:
                task_mixed.step++;
                task_mixed.run();
                break;
            case 26:
                task_mixed.step++;
                psy_delay(700);
                break;
            case 27:
                task_mixed.step++;
                addoutput(current_block.substring(6, current_block.length) + " " + setTimeout("blocks" + psy_blockorder + ".blocknumber", 0) + " " + biotech_electrical_tech_pleasant_unpleasant_list[tablerow].c1 + " " + keystatus.time + " " + keystatus.status);
                setTimeout(current_block + ".run()", 0);
                break
        }
    }
};
var block_biotech_electrical_tech = {
    blockname: "block_biotech_electrical_tech",
    step: 1,
    trial_counter: 0,
    trial_counter_per_task: [0],
    max_trials_in_block: 999999,
    criteria_fullfilled: 1,
    choosetask: 0,
    start: function() {
        block_biotech_electrical_tech.step = 1;
        current_block = "block_biotech_electrical_tech";
        block_biotech_electrical_tech.trial_counter_per_task[0] = 20;
        psy_clear_stimulus_counters_db();
        block_biotech_electrical_tech.run()
    },
    run: function() {
        current_block = block_biotech_electrical_tech.blockname;
        switch (block_biotech_electrical_tech.step) {
            case 1:
                block_biotech_electrical_tech.step++;
                psy_wait(instructions, 32);
                break;
            case 2:
                block_biotech_electrical_tech.step++;
                psy_clear_screen_db();
                block_biotech_electrical_tech.run();
                break;
            case 3:
                block_biotech_electrical_tech.step++;
                order = 1;
                setTimeout("block_biotech_electrical_tech.run()", 0);
                break;
            case 4:
                block_biotech_electrical_tech.step++;
                psy_clear_screen_db();
                block_biotech_electrical_tech.max_trials_in_block = 999999;
                block_biotech_electrical_tech.criteria_fullfilled = 1;
                if (block_biotech_electrical_tech.criteria_fullfilled > 0 && block_biotech_electrical_tech.trial_counter <= block_biotech_electrical_tech.max_trials_in_block) {
                    task_biotech_electrical_tech.start(TRIAL_SELECTION_ONCE)
                } else {
                    setTimeout("block_biotech_electrical_tech.run()", 0)
                }
                break;
            case 5:
                block_biotech_electrical_tech.step++;
                block_biotech_electrical_tech.trial_counter_per_task[0]--;
                if (block_biotech_electrical_tech.trial_counter_per_task[0] == 0 || block_biotech_electrical_tech.trial_counter >= block_biotech_electrical_tech.max_trials_in_block || tasklist_end_request == 1) {
                    block_biotech_electrical_tech.criteria_fullfilled = 0;
                    tasklist_end_request = 0
                }
                if (block_biotech_electrical_tech.criteria_fullfilled == 1) {
                    block_biotech_electrical_tech.step = block_biotech_electrical_tech.step - 2;
                    setTimeout("block_biotech_electrical_tech.run()", 0)
                } else {
                    setTimeout("block_biotech_electrical_tech.run()", 0)
                }
                break;
            case 6:
                block_biotech_electrical_tech.step++;
                psy_clear_screen_db();
                datalines = outputdata.split("\n");
                var tmptrialcount = 0;
                var tmplist = new Array;
                var tmpsum = 0;
                var tmpmin = 987654321;
                var tmpmax = -987654321;
                for (tmpx = 0; tmpx < datalines.length - 1; tmpx++) {
                    datalinenumbers = datalines[tmpx].split(/ +/);
                    if (parseInt(datalinenumbers[5 - 1]) == 1 & parseInt(datalinenumbers[2 - 1]) == 1) {
                        tmplist[tmptrialcount] = parseInt(datalinenumbers[3]);
                        tmpsum = tmpsum + parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) < tmpmin) tmpmin = parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) > tmpmax) tmpmax = parseInt(datalinenumbers[3]);
                        tmptrialcount++
                    }
                }
                if (tmptrialcount > 0) meanrt = Math.round(tmpsum / tmptrialcount);
                else meanrt = 0;
                tmptext = "Your average response speed is  " + meanrt + " milliseconds";
                psy_add_text_rgb_db(0, 0, 0, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, tmptext, 0);
                psy_draw_all_db();
                psy_add_text_rgb_db(0, 0, 100, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "press space to continue", 0);
                psy_draw_all_db();
                psy_wait(0, 32);
                break;
            case 7:
                block_biotech_electrical_tech.step++;
                psy_clear_screen_db();
                setTimeout("blocks" + psy_blockorder + ".run()", 0);
                break
        }
    }
};
var block_pleasant_unpleasant = {
    blockname: "block_pleasant_unpleasant",
    step: 1,
    trial_counter: 0,
    trial_counter_per_task: [0],
    max_trials_in_block: 999999,
    criteria_fullfilled: 1,
    choosetask: 0,
    start: function() {
        block_pleasant_unpleasant.step = 1;
        current_block = "block_pleasant_unpleasant";
        block_pleasant_unpleasant.trial_counter_per_task[0] = 20;
        psy_clear_stimulus_counters_db();
        block_pleasant_unpleasant.run()
    },
    run: function() {
        current_block = block_pleasant_unpleasant.blockname;
        switch (block_pleasant_unpleasant.step) {
            case 1:
                block_pleasant_unpleasant.step++;
                psy_wait(ready, 32);
                break;
            case 2:
                block_pleasant_unpleasant.step++;
                psy_clear_screen_db();
                block_pleasant_unpleasant.run();
                break;
            case 3:
                block_pleasant_unpleasant.step++;
                psy_clear_screen_db();
                block_pleasant_unpleasant.max_trials_in_block = 999999;
                block_pleasant_unpleasant.criteria_fullfilled = 1;
                if (block_pleasant_unpleasant.criteria_fullfilled > 0 && block_pleasant_unpleasant.trial_counter <= block_pleasant_unpleasant.max_trials_in_block) {
                    task_pleasant_unpleasant.start(TRIAL_SELECTION_ONCE)
                } else {
                    setTimeout("block_pleasant_unpleasant.run()", 0)
                }
                break;
            case 4:
                block_pleasant_unpleasant.step++;
                block_pleasant_unpleasant.trial_counter_per_task[0]--;
                if (block_pleasant_unpleasant.trial_counter_per_task[0] == 0 || block_pleasant_unpleasant.trial_counter >= block_pleasant_unpleasant.max_trials_in_block || tasklist_end_request == 1) {
                    block_pleasant_unpleasant.criteria_fullfilled = 0;
                    tasklist_end_request = 0
                }
                if (block_pleasant_unpleasant.criteria_fullfilled == 1) {
                    block_pleasant_unpleasant.step = block_pleasant_unpleasant.step - 2;
                    setTimeout("block_pleasant_unpleasant.run()", 0)
                } else {
                    setTimeout("block_pleasant_unpleasant.run()", 0)
                }
                break;
            case 5:
                block_pleasant_unpleasant.step++;
                psy_clear_screen_db();
                datalines = outputdata.split("\n");
                var tmptrialcount = 0;
                var tmplist = new Array;
                var tmpsum = 0;
                var tmpmin = 987654321;
                var tmpmax = -987654321;
                for (tmpx = 0; tmpx < datalines.length - 1; tmpx++) {
                    datalinenumbers = datalines[tmpx].split(/ +/);
                    if (parseInt(datalinenumbers[5 - 1]) == 1 & parseInt(datalinenumbers[2 - 1]) == 2) {
                        tmplist[tmptrialcount] = parseInt(datalinenumbers[3]);
                        tmpsum = tmpsum + parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) < tmpmin) tmpmin = parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) > tmpmax) tmpmax = parseInt(datalinenumbers[3]);
                        tmptrialcount++
                    }
                }
                if (tmptrialcount > 0) meanrt = Math.round(tmpsum / tmptrialcount);
                else meanrt = 0;
                tmptext = "Your average response speed is  " + meanrt + " milliseconds";
                psy_add_text_rgb_db(0, 0, 0, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, tmptext, 0);
                psy_draw_all_db();
                psy_add_text_rgb_db(0, 0, 100, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "press space to continue", 0);
                psy_draw_all_db();
                psy_wait(0, 32);
                break;
            case 6:
                block_pleasant_unpleasant.step++;
                psy_clear_screen_db();
                setTimeout("blocks" + psy_blockorder + ".run()", 0);
                break
        }
    }
};
var block_mix_compatible = {
    blockname: "block_mix_compatible",
    step: 1,
    trial_counter: 0,
    trial_counter_per_task: [0],
    max_trials_in_block: 999999,
    criteria_fullfilled: 1,
    choosetask: 0,
    start: function() {
        block_mix_compatible.step = 1;
        current_block = "block_mix_compatible";
        block_mix_compatible.trial_counter_per_task[0] = 20;
        psy_clear_stimulus_counters_db();
        block_mix_compatible.run()
    },
    run: function() {
        current_block = block_mix_compatible.blockname;
        switch (block_mix_compatible.step) {
            case 1:
                block_mix_compatible.step++;
                psy_wait(ready, 32);
                break;
            case 2:
                block_mix_compatible.step++;
                psy_clear_screen_db();
                block_mix_compatible.run();
                break;
            case 3:
                block_mix_compatible.step++;
                order = 1;
                setTimeout("block_mix_compatible.run()", 0);
                break;
            case 4:
                block_mix_compatible.step++;
                psy_clear_screen_db();
                block_mix_compatible.max_trials_in_block = 999999;
                block_mix_compatible.criteria_fullfilled = 1;
                if (block_mix_compatible.criteria_fullfilled > 0 && block_mix_compatible.trial_counter <= block_mix_compatible.max_trials_in_block) {
                    task_mixed.start(TRIAL_SELECTION_ONCE)
                } else {
                    setTimeout("block_mix_compatible.run()", 0)
                }
                break;
            case 5:
                block_mix_compatible.step++;
                block_mix_compatible.trial_counter_per_task[0]--;
                if (block_mix_compatible.trial_counter_per_task[0] == 0 || block_mix_compatible.trial_counter >= block_mix_compatible.max_trials_in_block || tasklist_end_request == 1) {
                    block_mix_compatible.criteria_fullfilled = 0;
                    tasklist_end_request = 0
                }
                if (block_mix_compatible.criteria_fullfilled == 1) {
                    block_mix_compatible.step = block_mix_compatible.step - 2;
                    setTimeout("block_mix_compatible.run()", 0)
                } else {
                    setTimeout("block_mix_compatible.run()", 0)
                }
                break;
            case 6:
                block_mix_compatible.step++;
                psy_clear_screen_db();
                datalines = outputdata.split("\n");
                var tmptrialcount = 0;
                var tmplist = new Array;
                var tmpsum = 0;
                var tmpmin = 987654321;
                var tmpmax = -987654321;
                for (tmpx = 0; tmpx < datalines.length - 1; tmpx++) {
                    datalinenumbers = datalines[tmpx].split(/ +/);
                    if (parseInt(datalinenumbers[5 - 1]) == 1 & parseInt(datalinenumbers[2 - 1]) == 3) {
                        tmplist[tmptrialcount] = parseInt(datalinenumbers[3]);
                        tmpsum = tmpsum + parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) < tmpmin) tmpmin = parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) > tmpmax) tmpmax = parseInt(datalinenumbers[3]);
                        tmptrialcount++
                    }
                }
                if (tmptrialcount > 0) meanrt_com = Math.round(tmpsum / tmptrialcount);
                else meanrt_com = 0;
                tmptext = "Your average response speed (compatible) is  " + meanrt + " milliseconds";
                psy_add_text_rgb_db(0, 0, 0, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, tmptext, 0);
                psy_draw_all_db();
                psy_add_text_rgb_db(0, 0, 100, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "press space to continue", 0);
                psy_draw_all_db();
                psy_wait(0, 32);
                break;
            case 7:
                block_mix_compatible.step++;
                psy_clear_screen_db();
                setTimeout("blocks" + psy_blockorder + ".run()", 0);
                break
        }
    }
};
var block_electrical_tech_biotech = {
    blockname: "block_electrical_tech_biotech",
    step: 1,
    trial_counter: 0,
    trial_counter_per_task: [0],
    max_trials_in_block: 999999,
    criteria_fullfilled: 1,
    choosetask: 0,
    start: function() {
        block_electrical_tech_biotech.step = 1;
        current_block = "block_electrical_tech_biotech";
        block_electrical_tech_biotech.trial_counter_per_task[0] = 20;
        psy_clear_stimulus_counters_db();
        block_electrical_tech_biotech.run()
    },
    run: function() {
        current_block = block_electrical_tech_biotech.blockname;
        switch (block_electrical_tech_biotech.step) {
            case 1:
                block_electrical_tech_biotech.step++;
                psy_wait(ready, 32);
                break;
            case 2:
                block_electrical_tech_biotech.step++;
                psy_clear_screen_db();
                block_electrical_tech_biotech.run();
                break;
            case 3:
                block_electrical_tech_biotech.step++;
                order = 2;
                setTimeout("block_electrical_tech_biotech.run()", 0);
                break;
            case 4:
                block_electrical_tech_biotech.step++;
                psy_clear_screen_db();
                block_electrical_tech_biotech.max_trials_in_block = 999999;
                block_electrical_tech_biotech.criteria_fullfilled = 1;
                if (block_electrical_tech_biotech.criteria_fullfilled > 0 && block_electrical_tech_biotech.trial_counter <= block_electrical_tech_biotech.max_trials_in_block) {
                    task_biotech_electrical_tech.start(TRIAL_SELECTION_ONCE)
                } else {
                    setTimeout("block_electrical_tech_biotech.run()", 0)
                }
                break;
            case 5:
                block_electrical_tech_biotech.step++;
                block_electrical_tech_biotech.trial_counter_per_task[0]--;
                if (block_electrical_tech_biotech.trial_counter_per_task[0] == 0 || block_electrical_tech_biotech.trial_counter >= block_electrical_tech_biotech.max_trials_in_block || tasklist_end_request == 1) {
                    block_electrical_tech_biotech.criteria_fullfilled = 0;
                    tasklist_end_request = 0
                }
                if (block_electrical_tech_biotech.criteria_fullfilled == 1) {
                    block_electrical_tech_biotech.step = block_electrical_tech_biotech.step - 2;
                    setTimeout("block_electrical_tech_biotech.run()", 0)
                } else {
                    setTimeout("block_electrical_tech_biotech.run()", 0)
                }
                break;
            case 6:
                block_electrical_tech_biotech.step++;
                psy_clear_screen_db();
                datalines = outputdata.split("\n");
                var tmptrialcount = 0;
                var tmplist = new Array;
                var tmpsum = 0;
                var tmpmin = 987654321;
                var tmpmax = -987654321;
                for (tmpx = 0; tmpx < datalines.length - 1; tmpx++) {
                    datalinenumbers = datalines[tmpx].split(/ +/);
                    if (parseInt(datalinenumbers[5 - 1]) == 1 & parseInt(datalinenumbers[2 - 1]) == 4) {
                        tmplist[tmptrialcount] = parseInt(datalinenumbers[3]);
                        tmpsum = tmpsum + parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) < tmpmin) tmpmin = parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) > tmpmax) tmpmax = parseInt(datalinenumbers[3]);
                        tmptrialcount++
                    }
                }
                if (tmptrialcount > 0) meanrt = Math.round(tmpsum / tmptrialcount);
                else meanrt = 0;
                tmptext = "Your average response speed is  " + meanrt + " milliseconds";
                psy_add_text_rgb_db(0, 0, 0, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, tmptext, 0);
                psy_draw_all_db();
                psy_add_text_rgb_db(0, 0, 100, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "press space to continue", 0);
                psy_draw_all_db();
                psy_wait(0, 32);
                break;
            case 7:
                block_electrical_tech_biotech.step++;
                psy_clear_screen_db();
                setTimeout("blocks" + psy_blockorder + ".run()", 0);
                break
        }
    }
};
var block_mix_incompatible = {
    blockname: "block_mix_incompatible",
    step: 1,
    trial_counter: 0,
    trial_counter_per_task: [0],
    max_trials_in_block: 999999,
    criteria_fullfilled: 1,
    choosetask: 0,
    start: function() {
        block_mix_incompatible.step = 1;
        current_block = "block_mix_incompatible";
        block_mix_incompatible.trial_counter_per_task[0] = 20;
        psy_clear_stimulus_counters_db();
        block_mix_incompatible.run()
    },
    run: function() {
        current_block = block_mix_incompatible.blockname;
        switch (block_mix_incompatible.step) {
            case 1:
                block_mix_incompatible.step++;
                psy_wait(ready, 32);
                break;
            case 2:
                block_mix_incompatible.step++;
                psy_clear_screen_db();
                block_mix_incompatible.run();
                break;
            case 3:
                block_mix_incompatible.step++;
                order = 2;
                setTimeout("block_mix_incompatible.run()", 0);
                break;
            case 4:
                block_mix_incompatible.step++;
                psy_clear_screen_db();
                block_mix_incompatible.max_trials_in_block = 999999;
                block_mix_incompatible.criteria_fullfilled = 1;
                if (block_mix_incompatible.criteria_fullfilled > 0 && block_mix_incompatible.trial_counter <= block_mix_incompatible.max_trials_in_block) {
                    task_mixed.start(TRIAL_SELECTION_ONCE)
                } else {
                    setTimeout("block_mix_incompatible.run()", 0)
                }
                break;
            case 5:
                block_mix_incompatible.step++;
                block_mix_incompatible.trial_counter_per_task[0]--;
                if (block_mix_incompatible.trial_counter_per_task[0] == 0 || block_mix_incompatible.trial_counter >= block_mix_incompatible.max_trials_in_block || tasklist_end_request == 1) {
                    block_mix_incompatible.criteria_fullfilled = 0;
                    tasklist_end_request = 0
                }
                if (block_mix_incompatible.criteria_fullfilled == 1) {
                    block_mix_incompatible.step = block_mix_incompatible.step - 2;
                    setTimeout("block_mix_incompatible.run()", 0)
                } else {
                    setTimeout("block_mix_incompatible.run()", 0)
                }
                break;
            case 6:
                block_mix_incompatible.step++;
                psy_clear_screen_db();
                datalines = outputdata.split("\n");
                var tmptrialcount = 0;
                var tmplist = new Array;
                var tmpsum = 0;
                var tmpmin = 987654321;
                var tmpmax = -987654321;
                for (tmpx = 0; tmpx < datalines.length - 1; tmpx++) {
                    datalinenumbers = datalines[tmpx].split(/ +/);
                    if (parseInt(datalinenumbers[5 - 1]) == 1 & parseInt(datalinenumbers[2 - 1]) == 5) {
                        tmplist[tmptrialcount] = parseInt(datalinenumbers[3]);
                        tmpsum = tmpsum + parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) < tmpmin) tmpmin = parseInt(datalinenumbers[3]);
                        if (parseInt(datalinenumbers[3]) > tmpmax) tmpmax = parseInt(datalinenumbers[3]);
                        tmptrialcount++
                    }
                }
                if (tmptrialcount > 0) meanrt_inc = Math.round(tmpsum / tmptrialcount);
                else meanrt_inc = 0;
                iat_effect = Math.round(meanrt_inc - meanrt_com);
                tmptext = "Your average response speed is in last block (incompatible) is  " + meanrt + " ms";
                psy_add_text_rgb_db(0, 0, -100, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, tmptext, 0);
                psy_draw_all_db();
                tmptext = "Your IAT compatibility effect = INC - COM = " + iat_effect + " ms";
                psy_add_text_rgb_db(0, 0, 0, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, tmptext, 0);
                psy_draw_all_db();
                psy_add_text_rgb_db(0, 0, 100, PSY_CENTRAL, PSY_CENTRAL, 255, 255, 255, "press space to continue", 0);
                psy_draw_all_db();
                psy_wait(0, 32);
                break;
            case 7:
                block_mix_incompatible.step++;
                psy_clear_screen_db();
                setTimeout("blocks" + psy_blockorder + ".run()", 0);
                break
        }
    }
};

function main() {
    c.focus();
    psy_screen_height = 600;
    psy_screen_width = 800;
    psy_screen_center_x = psy_screen_width / 2;
    psy_screen_center_y = psy_screen_height / 2;
    psy_set_coordinate_system("c");
    psy_exp_start_time = psy_exp_current_time = (new Date).getTime();
    psy_mouse_visibility(0);
    psy_load_font("Arial", 18);
    psy_load_bitmap("data:image/png;base64,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");
    psy_load_bitmap("data:image/png;base64,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");
    psy_load_bitmap("data:image/png;base64,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");
    psy_load_bitmap("data:image/png;base64,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");
    psy_blockorder = psy_random(1, 2);
    setTimeout("blocks" + psy_blockorder + ".run()", 1e3)
}
var blocks1 = {
    blocknumber: 0,
    nblocks: 5,
    run: function() {
        blocks1.blocknumber++;
        switch (blocks1.blocknumber) {
            case 1:
                block_biotech_electrical_tech.start();
                break;
            case 2:
                block_pleasant_unpleasant.start();
                break;
            case 3:
                block_mix_compatible.start();
                break;
            case 4:
                block_electrical_tech_biotech.start();
                break;
            case 5:
                block_mix_incompatible.start();
                break;
            case 6:
                showdata_html();
                break
        }
    }
};
var blocks2 = {
    blocknumber: 0,
    nblocks: 5,
    run: function() {
        blocks2.blocknumber++;
        switch (blocks2.blocknumber) {
            case 1:
                block_electrical_tech_biotech.start();
                break;
            case 2:
                block_pleasant_unpleasant.start();
                break;
            case 3:
                block_mix_incompatible.start();
                break;
            case 4:
                block_biotech_electrical_tech.start();
                break;
            case 5:
                block_mix_compatible.start();
                break;
            case 6:
                showdata_html();
                break
        }
    }
};

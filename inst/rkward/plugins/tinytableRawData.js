// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

// define variables globally
    function cleanStr(val) {
        if(!val) return '';
        return val.replace(/'/g, "\\'").replace(/"/g, '\\"');
    }

    function parseVar(fullPath) {
        if (!fullPath) return '';
        var raw_col = '';
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            raw_col = fullPath.split('$')[1];
        } else {
            raw_col = fullPath;
        }
        return raw_col;
    }
  

function preview(){
	preprocess(true);
	calculate(true);
	printout(true);
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(tinytable)){stop(" + i18n("Preview not available, because package tinytable is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(tinytable)\n");
	}	if(is_preview) {
		echo("if(!base::require(dplyr)){stop(" + i18n("Preview not available, because package dplyr is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(dplyr)\n");
	}	if(is_preview) {
		echo("if(!base::require(tidyr)){stop(" + i18n("Preview not available, because package tidyr is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(tidyr)\n");
	}	if(is_preview) {
		echo("if(!base::require(pandoc)){stop(" + i18n("Preview not available, because package pandoc is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(pandoc)\n");
	}	if(is_preview) {
		echo("if(!base::require(webshot2)){stop(" + i18n("Preview not available, because package webshot2 is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(webshot2)\n");
	}
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    var df = getValue('raw_df');
    var sub = cleanStr(getValue('raw_sub'));
    var drop_na = getValue('raw_drop_na') === '1';
    var vars = getValue('raw_vars');
    var agg = getValue('raw_agg') === '1';
    var headN = getValue('raw_head');

    echo('target_data <- ' + df + '\n');
    if (sub !== '') { echo('target_data <- subset(target_data, ' + sub + ')\n'); }
    if (drop_na) { echo('target_data <- tidyr::drop_na(target_data)\n'); }

    if (vars !== '') {
        var cList = vars.split('\n');
        var colList = [];
        for (var i = 0; i < cList.length; i++) { colList.push('\"' + parseVar(cList[i]) + '\"'); }
        echo('target_data <- target_data[, c(' + colList.join(', ') + '), drop = FALSE]\n');
    }

    if (agg) {
        echo('target_data <- target_data %>%\n');
        echo('  dplyr::group_by(dplyr::across(tidyselect::where(~ is.factor(.x) | is.character(.x)))) %>%\n');
        echo('  dplyr::summarise(dplyr::across(tidyselect::where(is.numeric), ~ mean(.x, na.rm = TRUE)), .groups = "drop")\n');
    }

    if (headN > 0) { echo('target_data <- head(target_data, ' + headN + ')\n'); }
    echo('\n');
  
    var cap = cleanStr(getValue('raw_cap'));
    var not = cleanStr(getValue('raw_not'));
    var w = getValue('raw_w');
    var dig = getValue('raw_dig');
    var rpl = cleanStr(getValue('raw_na'));
    var num_fmt = getValue('raw_num');
    var theme = getValue('raw_thm');
    var align = getValue('raw_aln');
    var fs = getValue('raw_fs');

    // 1. Base creation: tt()
    var tt_args = [];
    if (cap !== '') tt_args.push("caption = '" + cap + "'");
    if (not !== '') tt_args.push("notes = '" + not + "'");
    if (w > 0) tt_args.push("width = " + w);

    var base_cmd = 'tinytable::tt(target_data';
    if (tt_args.length > 0) { base_cmd += ', ' + tt_args.join(', '); }
    base_cmd += ')';

    echo('res_table <- ' + base_cmd + '\n');

    // 2. Formatting: format_tt()
    var fmt_args = [];
    if (rpl !== '') fmt_args.push("replace = '" + rpl + "'");
    if (num_fmt === 'scientific') fmt_args.push("num_fmt = 'scientific'");
    if (num_fmt === 'pct') fmt_args.push("num_fmt = 'pct'");
    fmt_args.push("digits = " + dig);

    if (fmt_args.length > 0) {
        echo('res_table <- res_table %>% tinytable::format_tt(' + fmt_args.join(', ') + ')\n');
    }

    // 3. Theme
    if (theme === 'striped') echo('res_table <- res_table %>% tinytable::theme_striped()\n');
    else if (theme === 'grid') echo('res_table <- res_table %>% tinytable::theme_grid()\n');
    else if (theme === 'empty') echo('res_table <- res_table %>% tinytable::theme_empty()\n');

    // 4. Styling
    var stl_args = [];
    if (align !== 'auto') {
        stl_args.push("j = 1:ncol(target_data)");
        stl_args.push("align = '" + align + "'");
    }
    if (fs > 0) stl_args.push("fontsize = " + fs);

    if (stl_args.length > 0) {
        echo('res_table <- res_table %>% tinytable::style_tt(' + stl_args.join(', ') + ')\n');
    }

    // 5. Apply Bold Styling to Totals (if they exist)
    var val_tr = getValue('raw_tot_row');
    var val_tc = getValue('raw_tot_col');
    var val_stat = getValue('raw_stat');

    var has_tot_row = (val_tr === '1');
    var has_tot_col = (val_tc === '1');
    var is_mean = (val_stat === 'mean');

    if (has_tot_row && !is_mean) {
        echo('res_table <- res_table %>% tinytable::style_tt(j = ncol(target_data), bold = TRUE)\n');
    }
    if (has_tot_col && !is_mean) {
        echo('res_table <- res_table %>% tinytable::style_tt(i = nrow(target_data), bold = TRUE)\n');
    }

    echo('\n');
    
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("tinytable (Raw Data) results")).print();	
	}
    var exp_file = cleanStr(getValue('raw_exp')).replace(/\\/g, '/');
    var exp_fmt = getValue('raw_efmt');

    // Solo guardamos en disco o Workspace si NO estamos en preview
    if (typeof is_preview === 'undefined' || !is_preview) {
        echo('rk.header("tinytable Output", level = 2)\n');

        if (exp_file !== '') {
            echo('\n# Export to disk\n');
            echo('out_file <- "' + exp_file + '"\n');
            echo('if (!grepl(paste0("\\\\.", "' + exp_fmt + '", "$"), out_file, ignore.case = TRUE)) {\n');
            echo('  out_file <- paste0(out_file, ".", "' + exp_fmt + '")\n');
            echo('}\n');

            // AQUI ESTA LA MAGIA: Agregamos overwrite = TRUE
            echo('tinytable::save_tt(res_table, out_file, overwrite = TRUE)\n');

            echo('rk.print(paste0("<i>Table exported to disk: </i><code>", out_file, "</code>"))\n');
        }

        if (getValue('raw_save.active')) {
            echo(getValue('raw_save') + ' <- res_table\n');
            echo('rk.print("<i>Table saved to workspace as: </i><code>' + getValue('raw_save') + '</code>")\n');
        }

        echo('rk.print("<hr>")\n');
    }

    // Renderizado HTML aislado con Inyección de Bootstrap usando srcdoc
    echo('tmp_html <- tempfile(fileext = ".html")\n');

    // AQUI TAMBIEN: Por seguridad, para el archivo temporal
    echo('tinytable::save_tt(res_table, tmp_html, overwrite = TRUE)\n');

    // 1. Leemos el HTML real generado sin advertencias
    echo('raw_html <- paste(suppressWarnings(readLines(tmp_html)), collapse = "\\n")\n');

    // 2. Le inyectamos Bootstrap y lo metemos en un documento
    echo('full_html <- paste0("<!DOCTYPE html><html><head><meta charset=\'utf-8\'><link href=\'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css\' rel=\'stylesheet\'></head><body style=\'padding: 20px;\'>\\n", raw_html, "\\n</body></html>")\n');

    // 3. Escapamos las comillas simples para que no rompan el iframe
    echo('full_html_escaped <- gsub("\'", "&#39;", full_html, fixed = TRUE)\n');

    // 4. Imprimimos el iframe usando srcdoc en lugar de file://
    echo('iframe_code <- paste0("<iframe srcdoc=\'", full_html_escaped, "\' width=\'100%\' height=\'500px\' style=\'border:none; overflow:auto;\'></iframe>")\n');
    echo('cat(iframe_code, file = rk.get.output.html.file(), append = TRUE)\n');
    
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var rawSave = getValue("raw_save");
		var rawSaveActive = getValue("raw_save.active");
		var rawSaveParent = getValue("raw_save.parent");
		// assign object to chosen environment
		if(rawSaveActive) {
			echo(".GlobalEnv$" + rawSave + " <- my_table\n");
		}	
	}

}


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

    var df = getValue('xtab_df');
    var sub = cleanStr(getValue('xtab_sub'));
    var drop_na = getValue('xtab_drop_na') === '1';
    var rows_raw = getValue('xtab_rows');
    var cols_raw = getValue('xtab_cols');
    var val_raw = getValue('xtab_val');
    var stat = getValue('xtab_stat');
    var bin_num = getValue('xtab_bin') === '1';

    echo('target_data <- ' + df + '\n');
    if (sub !== '') { echo('target_data <- subset(target_data, ' + sub + ')\n'); }
    if (drop_na) { echo('target_data <- tidyr::drop_na(target_data)\n'); }

    var r_arr = rows_raw.split('\n').map(parseVar).filter(Boolean);
    var c_arr = cols_raw !== '' ? cols_raw.split('\n').map(parseVar).filter(Boolean) : [];
    var v_col = val_raw !== '' ? parseVar(val_raw) : '';
    var v_col_calc = v_col;

    var all_vars = r_arr.concat(c_arr);
    var all_vars_quoted = all_vars.map(function(v) { return '`' + v + '`'; });
    var all_vars_string = all_vars.map(function(v) { return '\"' + v + '\"'; });

    if (bin_num) {
        if (v_col !== '' && stat !== 'count' && all_vars.indexOf(v_col) !== -1) {
            echo('target_data$`_val_orig` <- target_data$`' + v_col + '`\n');
            v_col_calc = '_val_orig';
        }

        echo('target_data <- target_data %>%\n');
        echo('  dplyr::mutate(dplyr::across(dplyr::any_of(c(' + all_vars_string.join(', ') + ')), function(x) {\n');
        echo('    if(is.numeric(x)) cut(x, breaks = max(2, grDevices::nclass.Sturges(na.omit(x))), include.lowest = TRUE, dig.lab = 4) else x\n');
        echo('  }))\n');
    }

    if (stat === 'count' || v_col === '') {
        echo('target_data <- target_data %>% dplyr::count(' + all_vars_quoted.join(', ') + ', name = "Value")\n');
    } else {
        var func = stat === 'mean' ? 'mean' : 'sum';
        echo('target_data <- target_data %>%\n');
        echo('  dplyr::group_by(' + all_vars_quoted.join(', ') + ') %>%\n');
        echo('  dplyr::summarise(Value = ' + func + '(`' + v_col_calc + '`, na.rm = TRUE), .groups = "drop")\n');
    }

    if (c_arr.length > 0) {
        var c_vars_quoted = 'c(' + c_arr.map(function(v) { return '`' + v + '`'; }).join(', ') + ')';
        var fill_val = (stat === 'count' || v_col === '') ? '0' : 'NA';
        echo('target_data <- target_data %>% tidyr::pivot_wider(names_from = ' + c_vars_quoted + ', values_from = Value, values_fill = list(Value = ' + fill_val + '))\n');
    } else {
        var final_name = (stat === 'count' || v_col === '') ? 'N' : (stat === 'mean' ? 'Mean' : 'Sum');
        echo('colnames(target_data)[ncol(target_data)] <- "' + final_name + '"\n');
    }

    // NUEVO: Calculate Totals
    var tot_row = getValue('xtab_tot_row') === '1';
    var tot_col = getValue('xtab_tot_col') === '1';

    if ((tot_row || tot_col) && stat !== 'mean') {
        echo('target_data <- target_data %>% dplyr::mutate(dplyr::across(tidyselect::where(~ is.factor(.x) | is.character(.x)), as.character))\n');
    }

    if (tot_row && stat !== 'mean') {
        echo('target_data <- target_data %>% dplyr::mutate(Total = rowSums(dplyr::select(., tidyselect::where(is.numeric)), na.rm = TRUE))\n');
    }

    if (tot_col && stat !== 'mean') {
        echo('target_data <- dplyr::bind_rows(target_data, dplyr::summarise(target_data, dplyr::across(tidyselect::where(is.numeric), ~ sum(.x, na.rm = TRUE))))\n');
        echo('target_data[nrow(target_data), 1] <- "Total"\n');
        echo('target_data <- target_data %>% dplyr::mutate(dplyr::across(tidyselect::where(is.character), ~ tidyr::replace_na(.x, "")))\n');
    }

    echo('\n');
  
    var cap = cleanStr(getValue('xtab_cap'));
    var not = cleanStr(getValue('xtab_not'));
    var w = getValue('xtab_w');
    var dig = getValue('xtab_dig');
    var rpl = cleanStr(getValue('xtab_na'));
    var num_fmt = getValue('xtab_num');
    var theme = getValue('xtab_thm');
    var align = getValue('xtab_aln');
    var fs = getValue('xtab_fs');

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
    var val_tr = getValue('xtab_tot_row');
    var val_tc = getValue('xtab_tot_col');
    var val_stat = getValue('xtab_stat');

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
		new Header(i18n("tinytable (Cross-Tabulation) results")).print();	
	}
    var exp_file = cleanStr(getValue('xtab_exp')).replace(/\\/g, '/');
    var exp_fmt = getValue('xtab_efmt');

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

        if (getValue('xtab_save.active')) {
            echo(getValue('xtab_save') + ' <- res_table\n');
            echo('rk.print("<i>Table saved to workspace as: </i><code>' + getValue('xtab_save') + '</code>")\n');
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
		var xtabSave = getValue("xtab_save");
		var xtabSaveActive = getValue("xtab_save.active");
		var xtabSaveParent = getValue("xtab_save.parent");
		// assign object to chosen environment
		if(xtabSaveActive) {
			echo(".GlobalEnv$" + xtabSave + " <- my_table\n");
		}	
	}

}


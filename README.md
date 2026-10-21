# rk.tinytable: Beautiful, Publication-Ready Tables for RKWard

![Version](https://img.shields.io/badge/Version-0.0.1-blue.svg)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![RKWard](https://img.shields.io/badge/Platform-RKWard-green)
[![R Linter](https://github.com/AlfCano/rk.tinytable/actions/workflows/lintr.yml/badge.svg)](https://github.com/AlfCano/rk.tinytable/actions/workflows/lintr.yml)
![AI Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?logo=googlegemini&logoColor=white)

**A Powerful GUI Wrapper for the `tinytable` Package Bringing Elegant Data Tables to RKWard**

`rk.tinytable` provides a seamless, point-and-click interface for creating, styling, and exporting beautiful, publication-ready tables directly within RKWard. This plugin leverages the highly versatile `tinytable` package, allowing users to generate complex cross-tabulations or format raw data into stunning tables with zero R code.

---

## 🌟 Key Features

*   **Zero-Code Table Generation:** Create professional tables directly from RKWard's GUI without writing a single line of R script.
*   **Intuitive Interface:** Cleanly organized tabbooks for data selection, content (titles/notes), numeric formatting, styling, and file export.
*   **Advanced Cross-Tabulations:** Easily calculate Counts, Means, or Sums across multiple variables. Includes automatic Sturges-rule binning for numeric variables.
*   **Automatic Margins (Totals):** Easily append Row and Column totals to your cross-tabulations. Totals are automatically calculated via `dplyr` and intelligently formatted with **bold** text using `tinytable` styling. *(Note: Automatically disabled when calculating Means to prevent invalid math).*
*   **Interactive HTML Previews:** Features an isolated HTML rendering engine with injected Bootstrap CSS to preview tables accurately inside RKWard before exporting.
*   **Comprehensive Customization:** Control column alignments, numeric formats (Scientific, Percentage), decimal places, themes (Grid, Striped, Empty), and custom NA replacements.

*   **Universal Export:** Save tables seamlessly into multiple formats including Word (`.docx`), HTML, PDF, PNG, Markdown, LaTeX, and Typst.
*   **Multilingual Ready:** Fully prepared for translation into English, Spanish, French, German, and Portuguese (Brazil).

---

> **⚠️ Note on HTML Previews vs. Exported Files:** 
> Advanced styling features—like `Striped` or `Grid` themes and specific column alignments—are heavily optimized for compiled backend engines (`pandoc`, `webshot2`, `typst`). While the live HTML preview inside RKWard uses a generalized Bootstrap layout to ensure rendering stability (which may override some inline CSS), your final exported `.docx`, `.pdf`, and `.png` files will beautifully retain all specific `tinytable` formatting and themes.

---

## What's New in Version 0.0.1

*   **Initial Release:** Introduces the foundational GUI for generating customized tables using the `tinytable` package.
*   **Dual Capabilities:** Includes two core modules: "Raw Data" (for filtering, selecting, and presenting data subsets) and "Cross-Tabulation" (for aggregating, binning, and summarizing).
*   **Safe HTML Injection:** Bypasses RKWard's default static graphical device to render robust, responsive HTML tables via `srcdoc` iframes.
*   **Overwrite Safety:** Built-in safeguards to properly overwrite exported files without raising internal R package errors.

---

## 🛠️ Dependencies

This plugin relies on the following R packages. RKWard will attempt to load them automatically, but you may need to install them if they are missing from your system:
*   `tinytable`, `dplyr`, `tidyr`
*   `webshot2` (Required for PNG exports)
*   `pandoc` (Required for Word/Markdown exports)

```R
install.packages(c("tinytable", "dplyr", "tidyr", "pandoc", "webshot2"))
```
*(Note: A local installation of [Pandoc](https://pandoc.org/) is required by R to export tables to formats like `.docx` and `.pdf`).*

---



## 🚀 Installation

You can install this plugin directly from GitHub using `remotes` or `devtools` inside your RKWard console:

```R
# Install the plugin
library("remotes")
install_github("AlfCano/rk.tinytable")
```

Once installed, restart RKWard to ensure the new menu entries and translations appear correctly.

---

## 🛠️ Usage Workflow

This plugin adds its core components under the **Analysis > Tables (tinytable)** menu in RKWard:

### 1. Raw Data
*Format and display subsets of your datasets directly.*
*   **Data & Filtering:** Select your data frame, subset by condition, drop missing values (`drop_na`), select specific columns, or aggregate basic numeric means.
*   **Table Content:** Add a formal Title (Caption) and Footer notes. Control the relative width of the table.
*   **Formatting & Theme:** Set decimal places, handle how NAs are displayed, apply global text alignment, and choose a visual theme (Default, Striped, Grid).
*   **Export:** Save the table back into the R Workspace or export it directly to your hard drive (Word, HTML, PDF, etc.).

### 2. Cross-Tabulation
*Aggregate and summarize relationships between multiple variables.*
*   **Data & Layout:** Assign Row and Column variables. Select a "Measurement" variable and a statistic to calculate (Count, Mean, Sum). 
*   **Smart Binning:** Check a single box to automatically bin numeric row/column variables into categorical ranges using the Sturges rule.
*   **Formatting & Export:** Apply all the same powerful theming, formatting, and export options available in the Raw Data module.
*   **Data & Layout:** Assign Row and Column variables. Select a statistic to calculate (Count, Mean, Sum). You can also toggle **Row Totals** and **Column Totals** with a single click to automatically generate bolded margin sums.

### 3. Universal Export (The "Write Once, Export Anywhere" Engine)
*   Export your exact table natively to:
    *   🌐 **HTML** (.html)
    *   📝 **Word** (.docx)
    *   📄 **PDF** (.pdf)
    *   🖼️ **PNG** (.png)
    *   🖨️ **LaTeX** (.tex) & **Typst** (.typ)

*(Note: Advanced features like stripes and specific alignments are heavily optimized for compiled outputs like Word, PDF, and PNG. The live HTML preview in RKWard utilizes a generalized Bootstrap layout for speed and compatibility).*

## 💻 Usage

Once installed, the tools are organized under:

**`Analysis` -> `Tables (tinytable)`**

## 🎓 Learning Exercises

Follow these step-by-step examples to master the table generation tools.

### 1. The Summary Table (Raw Data)
**Scenario:** We want a clean, publication-ready table showing the average characteristics of cars based on their cylinder count.

**A. Data Preparation (Run in Console):**
```R
# Load built-in dataset and make cylinders a factor
my_cars <- mtcars
my_cars$cyl <- as.factor(my_cars$cyl)
```

**B. Plugin Settings (tinytable - Raw Data):**
*   **Tab: Data & Filtering**
    *   **Data Frame:** `my_cars`
    *   **Variables to include:** `cyl`, `mpg`, `hp`, `wt`
    *   **Aggregate data:** `Checked` (Calculates Means of numeric columns)
*   **Tab: Formatting**
    *   **Decimals:** `1`
*   **Tab: Export**
    *   **Export as File:** `/path/to/save/Car_Summary.docx`

---

### 2. The Pivot Table (Cross-Tabulation)
**Scenario:** Analyzing the survival rates of Titanic passengers by Class and Sex.

**A. Data Preparation (Run in Console):**
```R
# Use the built-in Titanic dataset (convert to flat dataframe)
titanic_df <- as.data.frame(Titanic)
# Expand the frequencies back into raw rows for realistic cross-tabulation
titanic_raw <- titanic_df[rep(1:nrow(titanic_df), titanic_df$Freq), 1:4]
```

**B. Plugin Settings (tinytable - Cross-Tabulation):**
*   **Tab: Data & Layout**
    *   **Data Frame:** `titanic_raw`
    *   **Row Variable(s):** `Class`, `Sex`
    *   **Column Variable(s):** `Survived`
    *   **Statistic:** `Count (Frequencies / N)`
*   **Tab: Theme & Styling**
    *   **Table Theme:** `Striped`
    *   **Global Text Alignment:** `Center (c)`
*   **Tab: Export**
    *   **Export as File:** `/path/to/save/Titanic_Survival.pdf`


---

## 🌍 Internationalization (i18n)

The graphical interface automatically adapts to your RKWard language settings. Currently supported languages:
*   🇺🇸 English (Default)
*   🇪🇸 Spanish (Español)
*   🇫🇷 French (Français)
*   🇩🇪 German (Deutsch)
*   🇧🇷 Portuguese (Português do Brasil)

---

## 📝 License and Author

**Author:** Alfonso Cano ([@AlfCano](https://github.com/AlfCano))  
**Email:** alfonso.cano@correo.buap.mx  
*   **Assisted by:** Gemini, a large language model from Google.
*   **License:** GPL (>= 3)

This project is licensed under the **GPL (>= 3)** License.

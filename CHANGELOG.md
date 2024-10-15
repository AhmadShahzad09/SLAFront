# Changelog

## 2.7.0

*06-10-2020*

  - ods-calendar v2.1.0: new feature added, *firstDayOfWeek* option is now available. (@agonzalezs in !234)
  - ods-button v2.0.2: Apply the correct small height (28px). (@agonzalezs in !235)
  - ods-form-item v2.0.1: Fixed the bug where the label was displayed incorrectly when it didn't fit  (@agonzalezs in !236)
  - New font: Noto Kufi Arabic (@agonzalezs in !239)

## 2.6.0

*24-09-2020*

  - New componentes: ods-dataviz-bar, ods-dataviz-gauge, ods-dataviz-line y ods-dataviz-pie from echarts.(@agonzalezs in !217,!219)
  - New font available: JetBrains Mono (@agonzalezs in !217)
  - New icons: square-map, satelite, rectangle, line, legend-point, legend-closed-eye, circle, micro-off. (@agonzalezs in !218)

## 2.5.0

*21-09-2020*

  - ods-transfer v2.1.1: the filter functionality is fixed (@rguerreroj in !212)
    * Only the filtered options are visible
    * Unified styles with simple transfer
  - ods-tree v2.0.2: checkbox and indentation styles are fixed (@rguerreroj in !212)

*17-09-2020*

  - ods-transfer v2.1.0: new feature added, *tree* option is now available. (@rguerreroj in !206)
    * The component accepts now a nested array of items
    * Same features for default transfer are available
    * Fix styles
  - ods-tree v2.0.1: checkbox and indentation styles are fixed (@rguerreroj in !206)

## 2.4.0

*11-09-2020*
  
  - ods-input-number v2.0.6: solution to the problem of controls, the increase occupied part of the decrease. (@agonzalezs in !201)
  - New icons: 'entities', 'envelope', 'colorpicker', 'dislike', 'like', 'microphone', 'vote', 'video-camera', 'share-screen'. (@agonzalezs in !202)

## 2.3.0

*04-09-2020*
  
  - ods-pagination v2.0.1: solved the problem where the page number input had an incorrect width, and when putting an element after it in the layout, it is wrongly displayed. (@agonzalezs in !193)
  - ods-checkbox v2.0.1: the component loses focus when deselected (@agonzalezs in !194)
  - ods-checkbox-button v2.0.1: the component loses focus when deselected (@agonzalezs in !194)
  - New icons: card, cashier, cloud, coffee, groceries, hat, hotel, interest, mallet, money_bag, money_increase, non_fuel, ong, pensions, percentage, pet, pig, refund, renting, sell, taxes, terminal, tv, error-alert, warning-alert, success-alert, info-alert (@agonzalezs in !195)

## 2.2.6

*12-08-2020*
  
  - ods-input-number v2.0.5: solution for `NaN` issue when the value is empty. (@agonzalezs in !181)

## 2.2.5

*11-08-2020*
  
  - ods-scrollbar v2.0.4: Different bugs that occurred in firefox are fixed. (@agonzalezs in !174)
    * The last item of the ods-select component was cut, as well as in all components that incorporate it.
    * The ods-time-picker component had the same problem, the last item was cut.
    * The ods-scrollbar--main-content main container had two errors, its padding-right was incorrect, and it always left a blank space at the bottom.
  
## 2.2.4

*30-07-2020*
  
  - ods-input-number v2.0.4: Trailing zeros in precision mode. (@agonzalezs in !168)

## 2.2.3

*14-07-2020*
  
  - ods-select v2.0.3: Fixed the bug that component, with *filterable* prop, not working well.
    * The component lost focus, tabbing could not be accessed.  (@agonzalezs in !152)
    * Solved the problem that when the component was filterable and/or multiple, by selecting the same option previously selected, it allowed you to edit, being able to choose an option that was not available in the drop-down.  (@agonzalezs in !152)
    * In outlined mode, the down/up icon overlays the text. (@agonzalezs in !152)
    * When it is of the type `multiple/collapse-tag` and the value is higher than 10, the value is not displayed correctly. (@agonzalezs in !153)
  - ods-input-number v2.0.3: Return to the initial version of V2, because the solution for the fall of the model of the component towards which the component did not work well. (@agonzalezs in !151)
  
## 2.2.2

*07-07-2020*

  - ods-select v2.0.2: Fixed the bug that select with filtrable prop, not close in close icon event. (@agonzalezs in !128)
  - ods-input-number v2.0.2: Fixed the bug that wouldn't let you delete with the keyboard in some cases. (@agonzalezs in !127)
  - ods-date-picker v2.0.1.: *readonly* is now optional for 'dates' type. (@pgarizcun in !126)

## 2.2.1

*19-06-2020*

  - ods-input-number v2.0.1: v-model is now updated when the user type a value in the input. (@aatroccoli in !117)


## 2.2.0

*05-06-2020*

  - ods-breadcrumb v2.0.1: The breadcrumb component is now accessible (tab + enter key). (@agonzalezs in !114)
  - ods-input-search v2.0.2: The prop 'size' now has validation and accepts a new value ('full') that sets the width of the input to the full width of its container. (@prodrigueza in !102)
  - ods-select v2.0.1: The component has a bug that when it initially appears hidden, is shown, and its property of *disabled* is changed, its *height* was set to *40px*, this being incorrect.' (@agonzalezs in !108)
  - ods-radio-group v2.1.0: Added *fullWidth* type, the component behaves 100% of its container, adapting his children to the content. (@agonzalezs in !110)

## 2.1.1

*12-05-2020*

  - ods-input-search v2.0.1: the component is now transparent to the `ods-input` events and triggers the 'search' event on 'keyEnter' (@prodrigueza in !93)
  - ods-button v2.0.1: Change `circle` atribute scss default size to 40px (@pgarizcun in !94)
  - ods-date-pciker v2.0.1: The DatePicker `range` type, when it is clearable, the close icon still appears (@agonzalezs in !98)

## 2.1.0

*06-05-2020*

  - Change Gitlab repo (https://gitlab-ssdd.onesaitplatform.com/onesait/onesait-ux/ods)
  - New files structure
  - Refactoring dependencies pointing to @src
  - New way to compile styles, with webpack in a vue component (theme-onesait)
  - New compilation tasks from the install vue library
  - Refactoring styles and functionality in components with bugs
  - Created a development environment to develop components in local
  - Input search component now accesible, pulse enter to search.
  - Fixed bug in select filterable component in mobile
  - Full width option for checkbox group component

### 1.1.3

*22-04-2020*

- Add 'disabled' support to input search

### 1.1.2

*20-04-2020*

- Add 'order' and 'devilery-note' icons

### 1.1.1

*19-03-2020*

- Fixed select bug when resizing height by js

### 1.1.0

*26-02-2020*

- Release stable version

### 1.0.10

*21-02-2020*

- Select: fix multiple select with tags bug, the position of the tags containers, and apply new refactor styles

### 1.0.9

*13-02-2020*

- submenu: fix submenu problem with tooltip, change default openDelay prop to Number

### 1.0.8

*11-02-2020*

- main-navigation: Show active item when this item of menu is link  to a redirect route..

### 1.0.7

*04-02-2020*

- main-navigation: Control the submenu's internal scroll when you perform any action.

### 1.0.6

*30-01-2020*

- main-navigation: Fixed a bug when opening the submenu and not having space above. Added scroll component to the first level submenu when it doesn't have space below.

### 1.0.4

*21-11-2019*

- ADD galego locales

### 1.0.3

*17-10-2019*

- FIX `expandable` table row => arrow styles
- FIX `active menu item` repeated items bug


### 1.0.2

*11-10-2019*

- ADD `addable` tabs styles

### 1.0.1

*09-10-2019*

- ADD styles for a closable tab-item

### 1.0.0

*09-10-2019*

- FIX `ods icon initiatives` width
- UPDATE versioning logic. Starting semver

### 0.1.99

*08-10-2019*

- ADD `canSelectSeconds` prop to date time picker & date time range picker

### 0.1.98

*08-10-2019*

- FIX ODS icon reception

### 0.1.97

*08-10-2019*

- ADD ODS icons V9

### 0.1.96

*02-09-2019*

- ADD input-number `isWhite` and `readonly` options


### 0.1.95

*29-08-2019*

- FIX input search icon

### 0.1.94

*28-08-2019*

- FIX cascader height in dups

### 0.1.93

*22-08-2019*

- FIX cascader height

### 0.1.92

*22-08-2019*

- ADD sizes for input as textarea


### 0.1.91

*23-07-2019*

- ADD new props to main-header to force show menu mobile icon in non-standard projects

### 0.1.90

*11-07-2019*

- ADD ods icons version 8
- FIX tag content padding only child
- FIX breadcrumbs watchers

### 0.1.89

*02-07-2019*

- FIX cascader downgrade


### 0.1.88

*28-06-2019*

- FIX button option with icon but not circle

### 0.1.87

*28-06-2019*

- FIX button template order

### 0.1.86

*27-06-2019*

- FIX initiatives icon


### 0.1.85

*27-06-2019*

- FIX tooltip classes

### 0.1.84

*27-06-2019*

- ADDED onesait icons V7


### 0.1.83

*27-06-2019*

- GENERAL UPDATE in all components to 2.9 version
- ADDED new components from 2.9 version

### 0.1.82

*19-06-2019*

- FIX for IE11 in main header component: environment badge CSS class generated by computed property

### 0.1.80

*10-06-2019*

- FIX breadcrumb separator styles in Safari browsers


### 0.1.79

*05-06-2019*

- DELETE eot fonts from CSS to avoid IE11 crashes


### 0.1.78

*04-06-2019*

- FIX clear icon on datepicker is now hidden if `clearable` prop is set to `false`


### 0.1.77

*04-06-2019*

- ADD array of special days in datepicker type date


### 0.1.76

*29-05-2019* Beta version

- UPDATE tabs component
- FIX tabs component reactivity


### 0.1.75

*28-05-2019*

- ADD input-search can have default value, inherit from `$attrs.value`
- ADD tabs styles
- ADD uploader styles
- FIX date pickers inputLabel prop styles
- ADD webpack dashboard for web development project

### 0.1.74

*23-05-2019*

- ADD `UserMenuAlwaysOnHeader` prop to keep user menu always in main-header.
- ADD mobile menu button does not render if nav-component is not present in app.


### 0.1.73

*23-05-2019*

- FIX input suffix position

### 0.1.72

*22-05-2019*

- RENAME transitions used in main-navigation component, to prevent conflicts with project's transitions
- MOVE transitions SCSS to main components SCSS sheets from scoped blocks in `NavigationItem.vue` component


### 0.1.71

*22-05-2019*

- FIX deploy script
- FIX input-number component is empty if v-model is `NaN`

### 0.1.68

*21-05-2019*

- FIX `is-circle` `small` button width


### 0.1.67

*21-05-2019*

- FIX `zero-empty` prop works without `precision` prop in input-component


### 0.1.66

*21-05-2019*

- ADD `zero-empty` prop for input-number component


### 0.1.65

*13-05-2019*

- FIX cascader filterable: keyword span
- FIX is-circle button responsive
- FIX dialog width in mobile
- FIX select multiple collapsable, tags overflow
- ADD table sortable arrows behaviour
- ADD optional label for input component
- ADD header logo text can have HTML

### 0.1.64

*13-05-2019*

- ADD custom scrollbar in table component.
- FIX input-number, back to `type="text"`


### 0.1.63

*24-04-2019*

- ADD table row status. Doc examples and variables in SASS.

### 0.1.62

*23-04-2019*

- Stable version to NPM

### 0.1.61

*23-04-2019*

- ADD clearable option shows clear icon always in input, select, datepicker

### 0.1.60

*11-04-2019*

- FIX padding button small round
- ADD Main nav component emits `toggleCollapse` event on nav-collapse.

### 0.1.59

*11-04-2019*

- ADD main-navigation emits on toggleCollapse

### 0.1.58

*10-04-2019*

- ADD input-number: default sixe 'deci'


### 0.1.57

*09-04-2019*

- ADD input-search: outlined option
- ADD input-number: type="number"

### 0.1.56

*09-04-2019*

- BETA to latest

### 0.1.55

*09-04-2019*

- FIX input number - dependencies
- FIX input number - regex admits comma and dot
- FIX switch - heigth inside table-cell
- ADD switch - AAA options

### 0.1.54

*08-04-2019*

- ADD input number - regex match only numbers


### 0.1.53

*05-04-2019*

- UNDO input number toLocaleString


### 0.1.52

*05-04-2019*

- FIX input number increase/decrease
- FIX input number sizes


### 0.1.51

*04-04-2019*

- ADD outlined select component
- ADD ods-input-number component with toLocaleString options as props


### 0.1.50

*04-04-2019*

- ADD show-password input option
- FIX AAA for pagination componentent. FIX pagination styles
- FIX radio button label for & input ID
- ADD styles & AAA for pagination input switch

### 0.1.49

*18-03-2019*

- ADD onesait icons V5

### 0.1.48

*12-03-2019*

- FIX icon tag is now span tag


### 0.1.47

*12-03-2019*

- FIX icon tag is now span tag


### 0.1.45

*12-03-2019*

- ADD AAA support: icon, input, loading
- ADD label option for inputs
- FIX pagination layout


### 0.1.44

*07-03-2019*

- ADD mobile support for breadcrumbs
- FIX z-index nav mobile & z-index sub-header
- FIX switch vertical align ::after


### 0.1.43

*05-03-2019*

- FIX table `highlight-current-row` behaviour
- ADD _sub-header_ version and category
- ADD _topbar_ open method

### 0.1.42

*04-03-2019*

- FIX _has-top-bar_ prop in nav to adjust heigth


### 0.1.41

*04-03-2019*

- ADD topbar collapse transition

### 0.1.40

*01-03-2019*

- FIX cascader label option
- FIX item-form validation using `change` trigger on fomr rules object
- ADD top bar slot in main-header component


### 0.1.39

*27-02-2019*

- FIX tag close styles.
- ADD custom transition prop for Dialog: `transitionName`

### 0.1.38

*26-02-2019*

- FIX select styles using prefix slot.

### 0.1.37

*22-02-2019*

- FIX table hover styles.
- FIX table scroll heights in Chrome.
- FIX select undefined val using clearable option.
- ADD readonly state for inputs
- FIX button disabled state in _.is-circle.is-negative_ option
- ADD AAA Web Accessibility in HTML markup in Accordion, Alert, Avatar, Badge, Breadcrumb, Button, Cascader, Chart, Checkbox, ClickOutside, Datepicker, Dialog, Form
- ADD required props _cascaderLabel, checkboxLabel_ for AAA.
- ADD prop _cascaderLabel_ for show/hide required label.

### 0.1.35

*15-02-2019*

- FIX button styles in _secondary negative circle disabled hover_ case

### 0.1.34

*15-02-2019*

- ADD mobile styles to datepicker
- FIX button styles in all UI cases

### 0.1.33

*15-02-2019*

- FIX hide/show mobile close button for datepickers & timepickers

### 0.1.32

*13-02-2019*

- FIX right sass variables for theming components
- FIX scoped styles in ods-tag in multi select

### 0.1.31

*13-02-2019*

- FIX multiselect min & max tag size
- FIX tag component styles
- ADD Datepicker / Timepicker mobile fullscreen version
- FIX show active navigation menu-item when object is used in _to_ property
- CHECK loading z-index when used as fullscreen directive

### 0.1.30

*11-02-2019*

- FIX babel presets
- FIX Select suffix icons & behaviour

### 0.1.28

*08-02-2019*

- General update in all components
- Update to Webpack 4 in source project
- FIX close actions-menu on route change
- FIX styles in datepicker
- FIX logo vertical alignments
- FIX clearable inputs or selects, clear button always visible. Trash icon added.
- FIX Main Navigation closes submenus when route changes.
- FIX multiple select line height
- FIX pagination styles on hover and active items
- FIX butons styles. Secondary should be transparent. Negative should not have borders.
- FIX accordion styles. Background should be transparent. General paddings.
- FIX cascader styles on hover item
- FIX popper styles: removed triangle.

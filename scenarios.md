# Usage Scenarios

## Overview of Amidz features

- Can edit a `pattern chart` row by row.
- Can bundle multiple `pattern charts` as a `project`.
    - A single `project` kind of corresponds to a single work.
- Can lay `pattern charts` in a `project` out to show a complete image of the work.
    - A `pattern layout`.

## AMIDZ_S001. Starting the application

### Main

1. A `designer` starts `Amidz`.
2. `Amidz` creates a new `project`.
3. `amidz` creates a new `pattern chart` in the `project`.
4. `Amidz` displays a `pattern chart editor screen` to the `designer`.
5. `Amidz` shows the created `pattern chart` on the `pattern chart editor screen`.

## AMIDZ_S002. Placing a symbol

### Main

1. [Starting the application](#amidz_s001-starting-the-application)
    - Screen: `Pattern chart editor screen`
2. A `designer` is editing a `pattern chart` in a `project`.
3. `Amidz` shows a `symbol table` to the `designer`.
4. The `designer` chooses a `symbol` from the `symbol table`.
5. The `designer` selects a `column` to place the chosen `symbol`.
6. `Amidz` places the chosen `symbol` in the selected `column`.

## AMIDZ_S003. Saving a pattern chart

### Main

1. [Starting the application](#amidz_s001-starting-the-application)
    - Screen: `Pattern chart editor screen`
2. A `designer` is editing a `pattern chart` in a `project`.
3. The `designer` presses a `save pattern chart button`.
4. `Amidz` obtains the `pattern chart name` that is being edited.
5. `Amidz` saves the `pattern chart` associated with the `pattern chart name` in the `project`.

## AMIDZ_S004. Creating a new pattern chart

### Main

1. [Starting the application](#amidz_s001-starting-the-application)
    - Screen: `Pattern chart editor screen`
2. A `designer` is editing a `pattern chart` in a `project`.
3. The `designer` presses a `new pattern chart button`.
4. `Amidz` creates a new `pattern chart` in the `project`.
5. `Amidz` show the created `pattern chart` on the `pattern chart editor screen`.

## AMIDZ_S005. Displaying a pattern layout

### Main

1. [Starting the application](#amidz_s001-starting-the-application)
    - Screen: `Pattern chart editor screen`
2. A `designer` is editing a `pattern chart` in a `project`.
3. The `designer` presses a `layout button`.
4. `Amidz` obtains the `pattern layout` of the `project`.
5. `Amidz` displays a `pattern layout screen` to the `designer`.
6. `Amidz` shows the obtained `pattern layout` on the `pattern layout screen`.

## AMIDZ_S006. Laying a pattern chart out on a pattern layout

### Main

1. [Displaying a pattern layout](#amidz_005-displaying-a-pattern-layout)
    - Screen: `Pattern layout screen`
2. A `designer` is editing the `pattern layout` of a `project`.
3. `Amidz` displays the `pattern chart list` of the `project` to the `designer`.
4. The `designer` chooses a `pattern chart` to lay out from the `pattern chart list`.
5. The `designer` specifies a `location` to lay the chosen `pattern chart` out.
6. `Amidz` lays the chosen `pattern chart` out at the specified `location` on the `pattern layout` that is being edited.

## AMIDZ_S007. Streching and shrinking a pattern chart on a pattern layout

### Main

1. [Displaying a pattern layout](#amidz_005-displaying-a-pattern-layout)
    - Screen: `Pattern layout screen`
2. A `designer` is editing the `pattern layout` of a `project`.
3. The `designer` selects a `pattern chart` on the `pattern layout` that is being edit.
4. The `designer` presses a `strech and shrink button`.
5. `Amidz` asks the `designer` for a `scaling factor`.
6. The `designer` specifies the `scaling factor`.
7. `Amidz` streches the selected `pattern chart` by the specified `scaling factor`.

## AMIDZ_S008. Rotating a pattern chart on a pattern layout

### Main

1. [Displaying a pattern layout](#amidz_005-displaying-a-pattern-layout)
    - Screen: `Pattern layout screen`
2. A `designer` is editing the `pattern layout` of a `project`.
3. The `designer` selects a `pattern chart` on the `pattern layout` that is being edited.
4. The `designer` presses a `rotate button`.
5. `Amidz` asks the `designer` for a `rotation angle`.
6. The `designer` specifies the `rotation angle`.
7. `Amidz` rotates the selected `pattern chart` by the specified `rotation angle`.

## AMIDZ_S009. Transform a pattern chart along a path on a pattern layout

### Main

1. [Displaying a pattern layout](#amidz_005-displaying-a-pattern-layout)
    - Screen: `Pattern layout screen`
2. A `designer` is editing the `pattern layout` of a `project`.
3. The `designer` selects a `pattern chart` on the `pattern layout` that is being edited.
4. The `designer` presses a `transform along a path button`.
5. `Amidz` shows a `transformation path`.
6. The `designer` edits the `transformation path`.
7. The `designer` confirms the `transformation path`.
8. `Amidz` transforms the selected `pattern chart` along the confirmed `transformation path`.

## AMIDZ_S010. Downloading a pattern chart as an SVG image

### Main

1. [Starting application](#amidz_s001-starting-application)
    - Screen: `Pattern layout screen`
2. A `designer` is editing a `pattern chart` in a `project`.
3. The `designer` presses a `download SVG button`.
4. `Amidz` outputs the `pattern chart` that is being edited as an `SVG image`.
5. `Amidz` displays a `download screen` of the output `SVG image` to the `designer`.
6. The `designer` specifies the `download destination` of the output `SVG image`.
7. `Amidz` saves the output `SVG image` into the specified `download estination`.

## AMIDZ_S011. Downloading a pattern layout as an SVG image

### Main

1. [Displaying a pattern layout](#amidz_s005-displaying-a-pattern-layout)
2. A `designer` is editing the `pattern layout` of a `project`.
3. The `designer` presses a `download SVG button`.
4. `Amidz` outputs the `pattern layout` that is being edited as an `SVG image`.
5. `Amidz` displays a `download screen` of the output `SVG image` to the `designer`.
6. The `designer` specifies the `download destination` of the output `SVG image`.
7. `Amidz` saves the output `SVG image` into the specified `download destination`.
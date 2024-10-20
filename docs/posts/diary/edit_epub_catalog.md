---
date: 2024-10-12
category:
  - miscellany
tag:
  - tool
---


# epub file in essence is a zip


## the overview of file structure in an extracted epub file 

file structure, open with 7-zip or other rar tool

> file tree
> - root dir
>   - mimetype
>   - OEBPS
>     - Images (Static files)
>     - Styles (CSS styles)
>     - Text (all text files are included in here)
>     - content.opf (All Statics files are imported at here)
>     - toc.ncx (catalogs are shown in navigation)
>   - META-INF
 

## edit catalog of epub



if we want to have the structure is shown following

> - 1. the guide of operator system
>   - 1.1 system call
>   - 1.2 virtual memory


the structure is shown in content.opf is following
```html
<navMap>
    <navPoint id="QQ2-1-2" playOrder="QQ2-1-2">
        <navLabel>
            <text>1. the guide of operator system </text>
        </navLabel>
        <content src="Text/part0000.xhtml#x1-2000"/>

        <navPoint id="QQ2-1-3" playOrder="QQ2-1-3">
            <navLabel>
                <text>1.1 system call</text>
            </navLabel>
            <content src="Text/part0000.xhtml#x1-3000"/>
        </navPoint>

        <navPoint id="QQ2-1-4" playOrder="QQ2-1-4">
            <navLabel>
                <text>1.2 virtual memory</text>
            </navLabel>
            <content src="Text/part0000.xhtml#x1-4000"/>
        </navPoint>
    </navPoint>

</navMap>
```

[resolve_nav.html](resolve_nav.html)

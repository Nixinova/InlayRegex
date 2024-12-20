# Changelog

## 1.1.6
- Fixed sampled matches including the suffix of the regular expression source.
- Fixed expression flags not being applied properly.

## 1.1.5
- Added an error text in the hover menu for invalid regular expressions.
- Fixed the hover menu not appearing for invalid regular expressions.
- Fixed regular expressions containing escaped slashes not being parsed ([#4](https://github.com/Nixinova/InlayRegex/issues/4)).

## 1.1.4
- Fixed HTML tags being treated as regular expressions ((https://github.com/Nixinova/Inlay-Regex/issues/1)).

## 1.1.3
- Changed the description text in the hover window.
- Changed the sample matches list to always try to print five non-duplicate matches if possible.

## 1.1.2
- Added support for JSX and TSX.
- Changed output to create shorter wildcard results.

## 1.1.1
- Fixed expressions with escaped backslashes not displaying previews.
- Fixed unescaped characters breaking the preview formatting.

## 1.1.0
- Changed display of hints from an inline hint to be in a hover menu.
- Changed result to include a list of several sample matches.
- Fixed extension ocasionally crashing.

## 1.0.0
- Added inlay hints to preview regular expressions.

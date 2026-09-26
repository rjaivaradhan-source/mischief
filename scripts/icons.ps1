Add-Type -AssemblyName System.Drawing
$iconRoot = Join-Path $PSScriptRoot '../dist'
foreach ($size in @(32,192,512)) {
  $bitmap = New-Object System.Drawing.Bitmap($size,$size)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = 'AntiAlias'
  $g.ScaleTransform(($size/64.0),($size/64.0))
  $lime = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#c6fa57'))
  $ink = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#242421'))
  $purple = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#c6adff'))
  $bg = New-Object System.Drawing.Drawing2D.GraphicsPath
  $bg.AddArc(0,0,36,36,180,90); $bg.AddArc(28,0,36,36,270,90)
  $bg.AddArc(28,28,36,36,0,90); $bg.AddArc(0,28,36,36,90,90); $bg.CloseFigure()
  $g.FillPath($ink,$bg)
  $shape = New-Object System.Drawing.Drawing2D.GraphicsPath
  $shape.AddBezier(32,17,13,5,3,30,17,43)
  $shape.AddBezier(17,43,23,49,41,49,47,43)
  $shape.AddBezier(47,43,61,30,51,5,32,17); $shape.CloseFigure()
  $g.FillPath($lime,$shape)
  $right = New-Object System.Drawing.Drawing2D.GraphicsPath
  $right.AddBezier(32,17,51,5,61,30,47,43)
  $right.AddBezier(47,43,43,47,37,47,32,47); $right.CloseFigure()
  $g.FillPath($purple,$right); $g.FillEllipse($ink,20.5,24.5,5,7)
  $pen = New-Object System.Drawing.Pen($ink,3.5)
  $pen.StartCap='Round'; $pen.EndCap='Round'
  $g.DrawLine($pen,38,29,43,27)
  $g.DrawBezier($pen,25,36,29.6667,40.6667,34.3333,40.6667,39,36)
  $bitmap.Save((Join-Path $iconRoot "icon-$size.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $pen.Dispose(); $bg.Dispose(); $shape.Dispose(); $right.Dispose(); $purple.Dispose(); $lime.Dispose(); $ink.Dispose(); $g.Dispose(); $bitmap.Dispose()
}

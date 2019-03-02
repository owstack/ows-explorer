# This script requires Sketch on macOS – see readme.md for details

function postprocess {
  echo "Beginning image postprocessing in $1"

  echo "Postprocessing app assets..."

  echo "Combining favicon ico pngs into a single ICO file..."
  # convert ships with imagemagick
  convert $1/img/favicon/ico_16x16.png $1/img/favicon/ico_32x32.png $1/img/favicon/ico_48x48.png $1/img/favicon/ico_64x64.png $1/img/favicon.ico
  echo "Removing raw img/favicon/ico pngs..."
  rm -r $1/img/favicon/* && rmdir $1/img/favicon
}

# check args
if [ $# -eq 0 ]; then
    echo "App template name not specified"
    exit
fi

# setup locations
ROOT_PATH="../.."                           # Root directory of project
TEMPLATE_PATH="$ROOT_PATH/app-template/$1"  # Path to app template
RESOURCES_ROOT="$ROOT_PATH/resources"       # Path to project resources
RESOURCES_PATH="$RESOURCES_ROOT/$1"         # Path to project template specific resources for app

if [ ! -d "$TEMPLATE_PATH" ]; then
    echo "App template directory not found: $TEMPLATE_PATH"
  exit
fi

echo "Processing resources for $1"

# export all slices marked for export to the proper directory
echo "Exporting all assets from $TEMPLATE_PATH/resources.sketch"

# remove existing resources
rm -fr $RESOURCES_PATH

if [ -f /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool ]; then

  # export all slices marked for export to the proper directory
  echo "Exporting all assets from $TEMPLATE_PATH/resources.sketch"

  # Installed with sketchtool: https://developer.sketchapp.com/guides/sketchtool/
  /Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool export layers $TEMPLATE_PATH/resources.sketch --output=$TEMPLATE_PATH/resources

  postprocess $TEMPLATE_PATH/resources

else
  echo >&2 "Sketchtool is not installed, using pre-built resources from $TEMPLATE_PATH"
fi

echo "Publishing resources to $RESOURCES_PATH"
mkdir -p $RESOURCES_PATH
cp -R $TEMPLATE_PATH/resources/* $RESOURCES_PATH

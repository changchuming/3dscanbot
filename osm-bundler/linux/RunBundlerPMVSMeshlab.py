import os.path
import logging
import osmbundler
import osmpmvs
import subprocess
import string
import shutil

logging.basicConfig(level=logging.INFO, format="%(message)s")

# initialize OsmBundler manager class
manager = osmbundler.OsmBundler()
print "###1"
manager.preparePhotos()

print "###2"
manager.matchFeatures()

print "###3"
manager.doBundleAdjustment()

# manager.openResult()

# initialize OsmPMVS manager class
managerpmvs = osmpmvs.OsmPmvs(manager.workDir)

# initialize PMVS input from Bundler output
print "###4"
managerpmvs.doBundle2PMVS()

# call PMVS
print "###5"
managerpmvs.doPMVS()

# do meshlab reconstruction
print "###6"
#subprocess.call("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o %s/pmvs/models/pointcloud.x3d -s /home/ubuntu/3dscanbot/meshlab/empty.mlx" % (manager.workDir, manager.workDir), shell=True)
subprocess.call("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o ../../3dify.me/public/uploads/%s/model.x3d -s ../../meshlab/reconstruction.mlx" % (manager.workDir, os.path.basename(manager.photosArg)), shell=True)
# Transfer colour if reconstruction successful
if os.path.isfile("../../3dify.me/public/uploads/%s/model.x3d" % os.path.basename(manager.photosArg)):
  print "###7"
  subprocess.call("meshlabserver -i ../../3dify.me/public/uploads/%s/model.x3d %s/pmvs/models/pmvs_options.txt.ply -o ../../3dify.me/public/uploads/%s/coloredmodel.x3d -s ../../meshlab/colortransfer.mlx -om vc fq wn" % (os.path.basename(manager.photosArg), manager.workDir, os.path.basename(manager.photosArg)), shell=True)
  # Copy to folder
  print "###8"
  shutil.copy2('%s/pmvs/models/pmvs_options.txt.ply' % manager.workDir, '../../3dify.me/public/uploads/%s' % os.path.basename(manager.photosArg) + '/pointcloud.ply')
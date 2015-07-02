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
print "Progress: Preparing photos..."
manager.preparePhotos()

print "Progress: Matching features..."
manager.matchFeatures()

print "Progress: Doing bundle adjustments..."
manager.doBundleAdjustment()

# manager.openResult()

# initialize OsmPMVS manager class
managerpmvs = osmpmvs.OsmPmvs(manager.workDir)

# initialize PMVS input from Bundler output
print "Progress: Converting to PMVS format..."
managerpmvs.doBundle2PMVS()

# call PMVS
print "Progress: Generating dense point cloud..."
managerpmvs.doPMVS()

# do meshlab reconstruction
print "Progress: Reconstructing surface model based on dense point cloud..."
#subprocess.call("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o %s/pmvs/models/pointcloud.x3d -s /home/ubuntu/3dscanbot/meshlab/empty.mlx" % (manager.workDir, manager.workDir), shell=True)
subprocess.call("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o /home/ubuntu/3dscanbot/uploads/%s/model.x3d -s /home/ubuntu/3dscanbot/meshlab/reconstruction.mlx" % (manager.workDir, os.path.basename(manager.photosArg)), shell=True)
print "Progress: Transferring color from dense point cloud to surface model..."
subprocess.call("meshlabserver -i /home/ubuntu/3dscanbot/uploads/%s/model.x3d %s/pmvs/models/pmvs_options.txt.ply -o /home/ubuntu/3dscanbot/uploads/%s/coloredmodel.x3d -s /home/ubuntu/3dscanbot/meshlab/colortransfer.mlx -om vc fq wn" % (os.path.basename(manager.photosArg), manager.workDir, os.path.basename(manager.photosArg)), shell=True)

shutil.copy2('%s/pmvs/models/pmvs_options.txt.ply' % manager.workDir, '/home/ubuntu/3dscanbot/uploads/%s' % os.path.basename(manager.photosArg) + '/pointcloud.ply')
#shutil.copy2('%s/pmvs/models/model.x3d' % manager.workDir, '/home/ubuntu/3dscanbot/uploads/%s' % os.path.basename(manager.photosArg))
print "Progress: Files saved to /home/ubuntu/3dscanbot/uploads/%s" % os.path.basename(manager.photosArg)
#filename=manager.workDir.split('/')
# filename[1] is randomly generated folder name
import logging
import osmbundler
import osmpmvs
import subprocess
import string

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

print "Progress: Files saved to %s" % manager.workDir
# do meshlab reconstruction
print "Progress: Reconstructing surface model based on dense point cloud..."
subprocess.call("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o %s/pmvs/models/pmvs_options.txt.x3d -s /home/ubuntu/3dscanbot/meshlab/reconstruction.mlx" % (manager.workDir, manager.workDir), shell=True)
#filename=manager.workDir.split('/')
# filename[1] is randomly generated folder name
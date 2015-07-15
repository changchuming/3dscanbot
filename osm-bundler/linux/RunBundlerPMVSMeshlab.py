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
subprocess.call("meshlabserver -i %s/pmvs/models/pmvs_options.txt.ply -o /home/ubuntu/3dscanbot/3dify.me/public/uploads/%s/model.x3d -s /home/ubuntu/3dscanbot/meshlab/reconstruction.mlx" % (manager.workDir, os.path.basename(manager.photosArg)), shell=True)
print "###7"
subprocess.call("meshlabserver -i /home/ubuntu/3dscanbot/3dify.me/public/uploads/%s/model.x3d %s/pmvs/models/pmvs_options.txt.ply -o /home/ubuntu/3dscanbot/3dify.me/public/uploads/%s/coloredmodel.x3d -s /home/ubuntu/3dscanbot/meshlab/colortransfer.mlx -om vc fq wn" % (os.path.basename(manager.photosArg), manager.workDir, os.path.basename(manager.photosArg)), shell=True)

shutil.copy2('%s/pmvs/models/pmvs_options.txt.ply' % manager.workDir, '/home/ubuntu/3dscanbot/3dify.me/public/uploads/%s' % os.path.basename(manager.photosArg) + '/pointcloud.ply')
print "###8"
#shutil.copy2('%s/pmvs/models/model.x3d' % manager.workDir, '/home/ubuntu/3dscanbot/uploads/%s' % os.path.basename(manager.photosArg))
#print "Progress: Files saved to /home/ubuntu/3dscanbot/3dify.me/public/uploads/%s" % os.path.basename(manager.photosArg)
#filename=manager.workDir.split('/')
# filename[1] is randomly generated folder name
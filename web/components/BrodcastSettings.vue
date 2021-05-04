<template>
  <div>
    <button class="btn btn-light my-2 my-sm-0" data-toggle="modal" data-target="#exampleModal"><i class="fas fa-cog mr-1"></i> Settings</button>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Settings</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

                <form>
                    <div class="form-group">
                        <label for="abitrate">Audio Bitrate</label>
                        <div class="input-group">
                            <input type="number" class="form-control" placeholder="Audio bitrate" id="abitrate">
                            <div class="input-group-append">
                                <span class="input-group-text">Kbps</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="vbitrate">Video Bitrate</label>
                        <div class="input-group">
                            <input type="number" class="form-control" placeholder="Video bitrate" id="vbitrate">
                            <div class="input-group-append">
                                <span class="input-group-text">Kbps</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="fps">Frame Rate</label>
                        <div class="input-group">
                            <input type="number" class="form-control" placeholder="Frame rate" id="fps">
                            <div class="input-group-append">
                                <span class="input-group-text">Fps</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="resolution">Resolution</label>
                        <select class="custom-select" id="resolution">
                            <option value="1">240p</option>
                            <option value="2">480p</option>
                            <option value="3" selected>720p</option>
                            <option value="4">1080p</option>
                            <option value="5">2K</option>
                            <option value="6">4K</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
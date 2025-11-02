package com.scb.axessspringboottraining.repositories;

import com.scb.axessspringboottraining.entities.Application;
import com.scb.axessspringboottraining.entities.Comment;
import com.scb.axessspringboottraining.entities.CommentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByApplication(Application application);
    List<Comment> findByApplicationAndCommentType(Application application, CommentType commentType);
    Optional<Comment> findFirstByApplicationAndCommentTypeOrderByCreatedAtDesc(Application application, CommentType commentType);
}

